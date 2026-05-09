/**
 * generate_seed.js
 * Generates high-quality synthetic vehicle listings for Koli.one.
 * Part of the Hybrid Seed Data Strategy.
 */

const fs = require('fs');
const path = require('path');

const BRANDS = {
    "BMW": ["M5 Competition", "X5 M50i", "330i", "iX xDrive50"],
    "Mercedes-Benz": ["S500", "GLE 450", "C300", "EQS 580"],
    "Audi": ["RS6 Avant", "Q7 55 TFSI", "A4", "e-tron GT"],
    "Volkswagen": ["Golf 8 GTI", "Tiguan", "Passat", "ID.4"],
    "Toyota": ["RAV4 Hybrid", "Corolla", "Land Cruiser 300", "Hilux"],
    "Tesla": ["Model S Plaid", "Model 3 Performance", "Model Y", "Model X"]
};

const CITIES = ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "LPG"];
const TRANSMISSIONS = ["Automatic", "Manual"];

function generateRandomListing(id) {
    const brandNames = Object.keys(BRANDS);
    const brand = brandNames[Math.floor(Math.random() * brandNames.length)];
    const models = BRANDS[brand];
    const model = models[Math.floor(Math.random() * models.length)];
    
    const year = 2018 + Math.floor(Math.random() * 8); // 2018-2025
    const price = 20000 + Math.floor(Math.random() * 180000);
    const mileage = Math.floor(Math.random() * 120000);
    
    return {
        id: `listing_${id.toString().padStart(4, '0')}`,
        title: `${brand} ${model} ${year}`,
        brand: brand,
        model: model,
        year: year,
        price: price,
        currency: "BGN",
        mileage: mileage,
        fuel_type: FUEL_TYPES[Math.floor(Math.random() * FUEL_TYPES.length)],
        transmission: TRANSMISSIONS[Math.floor(Math.random() * TRANSMISSIONS.length)],
        city: CITIES[Math.floor(Math.random() * CITIES.length)],
        description: `Synthetic listing generated for Beta testing. High performance ${brand} ${model} in excellent condition.`,
        seller_id: `synthetic_seller_${Math.floor(Math.random() * 100)}`,
        status: "published",
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        images: ["placeholder_car.jpg"],
        verified_flag: Math.random() > 0.5,
        synthetic: true
    };
}

function generateBulk(count) {
    const listings = [];
    for (let i = 1; i <= count; i++) {
        listings.push(generateRandomListing(i));
    }
    return listings;
}

const count = 500;
const data = generateBulk(count);
const outputPath = path.join(__dirname, '../seed/synthetic_data.json');

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Successfully generated ${count} synthetic listings at ${outputPath}`);
