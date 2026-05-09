/**
 * ingest_seed.js
 * Validates and simulates ingestion of seed data into Firebase Firestore.
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../seed/synthetic_data.json');

if (!fs.existsSync(inputPath)) {
    console.error("Input file not found. Run generate_seed.js first.");
    process.exit(1);
}

const listings = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

console.log(`--- Starting Ingestion Simulation for ${listings.length} listings ---`);

let successCount = 0;
let errorCount = 0;

listings.forEach((item, index) => {
    // Validation Logic
    if (item.price > 0 && item.brand && item.model && item.seller_id) {
        // In a real environment, we would use:
        // await db.collection('listings').doc(item.id).set(item);
        if (index < 5) {
            console.log(`[SIMULATION] Writing ${item.id}: ${item.brand} ${item.model} to Firestore...`);
        }
        successCount++;
    } else {
        console.error(`[ERROR] Validation failed for listing ${item.id}`);
        errorCount++;
    }
});

console.log(`\n--- Ingestion Summary ---`);
console.log(`Successfully validated/processed: ${successCount}`);
console.log(`Failed: ${errorCount}`);
console.log(`Status: Ready for Real Ingestion to Firebase Staging.`);
