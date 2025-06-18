// sparql.js
// Generic SPARQL utility functions for the app

export const sparqlEndpointUrl = 'http://localhost:8080/query/sparql';

export const executeSparqlQuery = async (sparqlQuery) => {
    const urlWithQuery = `${sparqlEndpointUrl}?query=${encodeURIComponent(sparqlQuery)}`;
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

export const fetchAllTags = async (setAllTags, setLoadingTags, force = false) => {
    const cacheKey = 'allLscTags';
    setLoadingTags(true); // Always set loading true at the start
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
    } catch (err) {
        console.error('Error fetching tags for autocomplete:', err);
    } finally {
        setLoadingTags(false);
    }
};

export const fetchAllCountries = async (setAllCountries, setLoadingCountries, force = false) => {
    const cacheKey = 'allLscCountries';
    setLoadingCountries(true); // Always set loading true at the start
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
    }
};
