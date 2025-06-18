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
    if (!force) {
        try {
            const cachedTags = localStorage.getItem(cacheKey);
            if (cachedTags) {
                const tags = JSON.parse(cachedTags).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                setAllTags(tags);
                setLoadingTags(false);
                return;
            }
        } catch (e) {
            console.error('Could not access localStorage:', e);
        }
    }
    const tagsQuery = `
        SELECT DISTINCT ?tag
        WHERE {
            ?s <http://lsc.dcu.ie/schema#tag> ?tag .
        }
    `;
    try {
        setLoadingTags(true);
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
    if (!force) {
        try {
            const cachedCountries = localStorage.getItem(cacheKey);
            if (cachedCountries) {
                const countries = JSON.parse(cachedCountries).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                setAllCountries(countries);
                setLoadingCountries(false);
                return;
            }
        } catch (e) {
            console.error('Could not access localStorage:', e);
        }
    }
    const countriesQuery = `
        SELECT DISTINCT ?country
        WHERE {
            ?s <http://lsc.dcu.ie/schema#country> ?country .
        }
    `;
    try {
        setLoadingCountries(true);
        const bindings = await executeSparqlQuery(countriesQuery);
        const countries = bindings
            .map(binding => {
                const fullCountry = binding.country?.value;
                if (!fullCountry) return null;
                const idx = fullCountry.indexOf('http://lsc.dcu.ie/country#');
                const countryName = idx !== -1 ? fullCountry.substring('http://lsc.dcu.ie/country#'.length) : fullCountry;
                return countryName;
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
