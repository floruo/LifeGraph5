import configLocal from './config.local.json';

// src/config.js
// SPARQL endpoint URL
export const SPARQL_ENDPOINT = "http://localhost:8080/query/sparql";

// DRES API endpoint
export const DRES_API_ENDPOINT = "https://vbs.videobrowsing.org";
export const DRES_USER = configLocal?.DRES_USER?.trim() ? configLocal.DRES_USER : "MyUserName";
export const DRES_PASSWORD = configLocal?.DRES_PASSWORD?.trim() ? configLocal.DRES_PASSWORD : "MyPassword";
export const DRES_ENABLED = Boolean(configLocal?.DRES_USER?.trim() && configLocal?.DRES_PASSWORD?.trim());

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
