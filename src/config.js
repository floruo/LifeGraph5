// src/config.js

// SPARQL endpoint URL
export const SPARQL_ENDPOINT = "http://localhost:8080/query/sparql";

// DRES API endpoint
export const DRES_API_ENDPOINT = "https://vbs.videobrowsing.org";
let DRES_USER = "MyUserName";
let DRES_PASSWORD = "MyPassword";
try {
    const config = (await import("./config.local.json")).default;
    DRES_USER = config.DRES_USER;
    DRES_PASSWORD = config.DRES_PASSWORD;
} catch (e) {
    console.warn("config.local.json not found or invalid. Using default credentials.");
}

export { DRES_USER, DRES_PASSWORD };


// Configurable filter order for collapsibles
export const FILTER_ORDER = [
    'tags',
    'category',
    'country',
    'city',
    'location',
    'date',
    'time',
    'caption',
    'ocr',
    'clip',
];

export const RESULTS_PER_ROW = 8;
