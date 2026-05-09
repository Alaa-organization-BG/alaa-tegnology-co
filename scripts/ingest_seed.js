/**
 * ingest_seed.js
 * Validates and ingests seed data into Firebase Firestore using Admin SDK.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Arguments: node scripts/ingest_seed.js --serviceAccount=path/to/key.json --env=staging --dryRun=false
const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.split('=');
    acc[key.replace('--', '')] = value;
    return acc;
}, {});

const serviceAccountPath = args.serviceAccount || process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const isDryRun = args.dryRun !== 'false';
const env = args.env || 'staging';

if (!serviceAccountPath && !isDryRun) {
    console.error("Error: Service account key is required for real ingestion. Use --serviceAccount or set FIREBASE_SERVICE_ACCOUNT_PATH.");
    process.exit(1);
}

if (!isDryRun) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = !isDryRun ? admin.firestore() : null;
const inputPath = path.join(__dirname, '../seed/synthetic_data.json');
const listings = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

console.log(`--- Starting ${isDryRun ? 'SIMULATION' : 'REAL INGESTION'} for ${listings.length} listings to ${env} ---`);

async function ingest() {
    let successCount = 0;
    const batch = !isDryRun ? db.batch() : null;

    for (const item of listings) {
        if (item.price > 0 && item.brand && item.model) {
            if (!isDryRun) {
                const docRef = db.collection('listings').doc(item.id);
                batch.set(docRef, {
                    ...item,
                    ingested_at: admin.firestore.FieldValue.serverTimestamp(),
                    source: 'synthetic'
                });
            } else {
                if (successCount < 5) console.log(`[DRY RUN] Would write ${item.id}`);
            }
            successCount++;
        }
    }

    if (!isDryRun && successCount > 0) {
        await batch.commit();
        console.log(`[SUCCESS] Committed batch write to Firestore.`);
    }

    console.log(`\n--- Summary ---`);
    console.log(`Processed: ${successCount}`);
    console.log(`Status: ${isDryRun ? 'Dry Run Complete' : 'Data Live on Firebase'}`);
}

ingest().catch(console.error);
