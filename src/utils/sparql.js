// Generic SPARQL utility functions for the app

import { SPARQL_ENDPOINT } from '../config';

export const executeSparqlQuery = async (sparqlQuery) => {
    const urlWithQuery = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(sparqlQuery)}`;
    const response = await fetch(urlWithQuery, {
        method: 'GET',
        headers: {
            'Accept': 'application/sparql-results+json'
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.results && data.results.bindings ? data.results.bindings : [];
};

// Locks to prevent duplicate API calls
let tagsFetchInProgress = false;
let countriesFetchInProgress = false;
let categoriesFetchInProgress = false;
let citiesFetchInProgress = false;
let dayRangeFetchInProgress = false;
let locationsFetchInProgress = false;

export const fetchAllTags = async (setAllTags, setLoadingTags, force = false) => {
    if (tagsFetchInProgress) return;
    tagsFetchInProgress = true;
    const cacheKey = 'allLscTags';
    setLoadingTags(true);
    try {
        if (force) {
            try {
                localStorage.removeItem(cacheKey);
            } catch (e) {
                console.error('Could not remove tags from localStorage:', e);
            }
        } else {
            const cachedTags = localStorage.getItem(cacheKey);
            if (cachedTags) {
                const tags = JSON.parse(cachedTags).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                setAllTags(tags);
                setLoadingTags(false);
                return;
            }
        }
        const tagsQuery = `
            SELECT DISTINCT ?tag
            WHERE {
                ?s <http://lsc.dcu.ie/schema#tag> ?tag .
            }
        `;
        console.log("Fetching tags from SPARQL endpoint...");
        const bindings = await executeSparqlQuery(tagsQuery);
        const tags = bindings
            .map(binding => {
                const fullTag = binding.tag?.value;
                if (!fullTag) return null;
                const idx = fullTag.indexOf('http://lsc.dcu.ie/tag#');
                const tagName = idx !== -1 ? fullTag.substring('http://lsc.dcu.ie/tag#'.length) : fullTag;
                return tagName;
            })
            .filter(Boolean)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        setAllTags(tags);
        try {
            localStorage.setItem(cacheKey, JSON.stringify(tags));
        } catch (e) {
            console.error('Could not save tags to localStorage:', e);
        }
    } catch (e) {
        setAllTags([]);
        console.error('Error fetching tags:', e);
    } finally {
        setLoadingTags(false);
        tagsFetchInProgress = false;
    }
};

export const fetchAllCountries = async (setAllCountries, setLoadingCountries, force = false) => {
    if (countriesFetchInProgress) return;
    countriesFetchInProgress = true;
    const cacheKey = 'allLscCountries';
    setLoadingCountries(true);
    try {
        if (force) {
            try {
                localStorage.removeItem(cacheKey);
            } catch (e) {
                console.error('Could not remove countries from localStorage:', e);
            }
        } else {
            const cachedCountries = localStorage.getItem(cacheKey);
            if (cachedCountries) {
                const countries = JSON.parse(cachedCountries).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                setAllCountries(countries);
                setLoadingCountries(false);
                return;
            }
        }
        const countriesQuery = `
            SELECT DISTINCT ?country
            WHERE {
                ?s <http://lsc.dcu.ie/schema#country> ?country .
            }
        `;
        const bindings = await executeSparqlQuery(countriesQuery);
        const countries = bindings
            .map(binding => {
                const fullCountry = binding.country?.value;
                if (!fullCountry) return null;
                return fullCountry;
            })
            .filter(Boolean)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        setAllCountries(countries);
        try {
            localStorage.setItem(cacheKey, JSON.stringify(countries));
        } catch (e) {
            console.error('Could not save countries to localStorage:', e);
        }
    } catch (err) {
        console.error('Error fetching countries for autocomplete:', err);
    } finally {
        setLoadingCountries(false);
        countriesFetchInProgress = false;
    }
};

export const fetchAllCategories = async (setAllCategories, setLoadingCategories, force = false) => {
    if (categoriesFetchInProgress) return;
    categoriesFetchInProgress = true;
    const cacheKey = 'allLscCategories';
    setLoadingCategories(true);
    try {
        if (force) {
            try {
                localStorage.removeItem(cacheKey);
            } catch (e) {
                console.error('Could not remove categories from localStorage:', e);
            }
        } else {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const categories = JSON.parse(cached).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                setAllCategories(categories);
                setLoadingCategories(false);
                return;
            }
        }
        const categoriesQuery = `
            SELECT DISTINCT ?category
            WHERE {
                ?s <http://lsc.dcu.ie/schema#category> ?category .
            }
        `;
        const bindings = await executeSparqlQuery(categoriesQuery);
        const categories = bindings
            .map(binding => binding.category?.value)
            .filter(Boolean)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        setAllCategories(categories);
        try {
            localStorage.setItem(cacheKey, JSON.stringify(categories));
        } catch (e) {
            console.error('Could not save categories to localStorage:', e);
        }
    } catch (e) {
        setAllCategories([]);
        console.error('Error fetching categories:', e);
    } finally {
        setLoadingCategories(false);
        categoriesFetchInProgress = false;
    }
};

export const fetchAllCities = async (setAllCities, setLoadingCities, force = false) => {
    if (citiesFetchInProgress) return;
    citiesFetchInProgress = true;
    const cacheKey = 'allLscCities';
    setLoadingCities(true);
    try {
        if (force) {
            try {
                localStorage.removeItem(cacheKey);
            } catch (e) {
                console.error('Could not remove cities from localStorage:', e);
            }
        } else {
            const cachedCities = localStorage.getItem(cacheKey);
            if (cachedCities) {
                const cities = JSON.parse(cachedCities).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                setAllCities(cities);
                setLoadingCities(false);
                return;
            }
        }
        const citiesQuery = `
            SELECT DISTINCT ?city
            WHERE {
                ?s <http://lsc.dcu.ie/schema#city> ?city .
            }
        `;
        const bindings = await executeSparqlQuery(citiesQuery);
        const cities = bindings
            .map(binding => {
                const fullCity = binding.city?.value;
                if (!fullCity) return null;
                // Remove datatype if present (e.g., ^^String)
                return fullCity.split('^^')[0].trim();
            })
            .filter(Boolean)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        setAllCities(cities);
        try {
            localStorage.setItem(cacheKey, JSON.stringify(cities));
        } catch (e) {
            console.error('Could not save cities to localStorage:', e);
        }
    } catch (err) {
        console.error('Error fetching cities for autocomplete:', err);
        setAllCities([]);
    } finally {
        setLoadingCities(false);
        citiesFetchInProgress = false;
    }
};

export const fetchAllLocations = async (setAllLocations, setLoadingLocations, force = false) => {
    if (locationsFetchInProgress) return;
    locationsFetchInProgress = true;
    const cacheKey = 'allLscLocations';
    setLoadingLocations(true);
    try {
        if (force) {
            try {
                localStorage.removeItem(cacheKey);
            } catch (e) {
                console.error('Could not remove locations from localStorage:', e);
            }
        } else {
            const cachedLocations = localStorage.getItem(cacheKey);
            if (cachedLocations) {
                const locations = JSON.parse(cachedLocations).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                setAllLocations(locations);
                setLoadingLocations(false);
                return;
            }
        }
        const locationsQuery = `
            SELECT DISTINCT ?location_name
            WHERE {
                ?s <http://lsc.dcu.ie/schema#location_name> ?location_name .
            }
        `;
        const bindings = await executeSparqlQuery(locationsQuery);
        const locations = bindings
            .map(binding => binding.location_name?.value)
            .filter(Boolean)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        setAllLocations(locations);
        try {
            localStorage.setItem(cacheKey, JSON.stringify(locations));
        } catch (e) {
            console.error('Could not save locations to localStorage:', e);
        }
    } catch (e) {
        setAllLocations([]);
        console.error('Error fetching locations:', e);
    } finally {
        setLoadingLocations(false);
        locationsFetchInProgress = false;
    }
};

// Fetch and cache the day range, ensuring only one API call is made at a time
let dayRangePromise = null;
export const fetchDayRange = async (force = false) => {
    if (dayRangeFetchInProgress) return;
    dayRangeFetchInProgress = true;
    const cacheKey = 'allLscDayRange';
    if (!force) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                dayRangeFetchInProgress = false;
                return JSON.parse(cached);
            } catch (e) {
                // ignore parse error, fall through to fetch
            }
        }
        if (dayRangePromise) {
            dayRangeFetchInProgress = false;
            return dayRangePromise;
        }
    } else {
        try {
            localStorage.removeItem(cacheKey);
        } catch (e) {
            // ignore
        }
        dayRangePromise = null;
    }
    dayRangePromise = (async () => {
        const query = `
            SELECT (MIN(?date) AS ?minDate) (MAX(?date) AS ?maxDate)
            WHERE {
                ?s <http://lsc.dcu.ie/schema#day> ?date .
            }
        `;
        const bindings = await executeSparqlQuery(query);
        let result;
        if (bindings.length > 0) {
            result = {
                min: bindings[0].minDate.value.replace('http://lsc.dcu.ie/day#', ''),
                max: bindings[0].maxDate.value.replace('http://lsc.dcu.ie/day#', ''),
            };
            try {
                localStorage.setItem(cacheKey, JSON.stringify(result));
            } catch (e) {
                // ignore
            }
        } else {
            result = { min: '2019-01-01', max: '2019-12-31' };
        }
        dayRangeFetchInProgress = false;
        dayRangePromise = null;
        return result;
    })();
    return dayRangePromise;
};
