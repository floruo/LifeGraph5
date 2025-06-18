// App.jsx
import React, { useState, useEffect } from 'react';
import TagSelector from './components/TagSelector';
import CountrySelector from './components/CountrySelector';
import { executeSparqlQuery, fetchAllTags, fetchAllCountries } from './utils/sparql';

// CollapsiblePanel component for left/right columns
const CollapsiblePanel = ({ title, children, defaultOpen = true, className = "" }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className={`bg-gray-50 rounded-lg shadow-md p-4 w-full max-w-xs flex flex-col items-start ${className}`}>
            <button
                className="mb-2 text-sm font-semibold text-blue-700 hover:underline focus:outline-none"
                onClick={() => setOpen(o => !o)}
                type="button"
            >
                {open ? '▼' : '►'} {title}
            </button>
            {open && <div className="w-full">{children}</div>}
        </div>
    );
};

const App = () => {
    // State to store URIs
    const [imageUris, setImageUris] = useState([]);
    const [loading, setLoading] = useState(false);         // State to manage loading status (initially false)
    const [error, setError] = useState(null);             // State to store any errors
    const [triggerFetch, setTriggerFetch] = useState(0);  // State to trigger fetch manually
    const [allTags, setAllTags] = useState([]);           // State to store all available tags for autocomplete
    const [loadingTags, setLoadingTags] = useState(true); // State for tag loading

    // Country selector state
    const [allCountries, setAllCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countrySearch, setCountrySearch] = useState('');
    const [forceFetchCountries, setForceFetchCountries] = useState(false);

    // State for URI overlay
    const [overlayImageUrl, setOverlayImageUrl] = useState(null);

    // State for selected tags
    const [selectedTags, setSelectedTags] = useState([]); // Array of selected tags

    // State for tag search input in the select box
    const [tagSearch, setTagSearch] = useState('');

    // State for union/intersection mode
    const [queryMode, setQueryMode] = useState('intersection'); // 'intersection' or 'union'

    // State for query execution time
    const [queryTime, setQueryTime] = useState(null);
    const [forceFetchTags, setForceFetchTags] = useState(false);

    // Collapsible state for SPARQL query
    const [showSparql, setShowSparql] = useState(false);

    // Ensure queryMode is reset to 'intersection' if only one or zero tags are selected
    useEffect(() => {
        if (selectedTags.length <= 1 && queryMode !== 'intersection') {
            setQueryMode('intersection');
        }
    }, [selectedTags, queryMode]);

    // Function to fetch data from the SPARQL endpoint based on the constructed query
    const fetchImageUris = async () => {
        const sparqlQuery = getSparqlQuery();
        if (!sparqlQuery) {
            setImageUris([]);
            setError(null);
            setQueryTime(null);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            setImageUris([]);
            setQueryTime(null);
            const start = performance.now();
            const bindings = await executeSparqlQuery(sparqlQuery);
            const end = performance.now();
            setQueryTime(end - start);
            const uris = bindings
                .map(binding => binding.s?.value)
                .filter(Boolean);
            setImageUris(uris);
        } catch (err) {
            console.error('Error fetching image data:', err);
            setError(`Failed to fetch data: ${err.message}`);
            setQueryTime(null);
        } finally {
            setLoading(false);
        }
    };

    // Function to construct the SPARQL query for display and execution
    const getSparqlQuery = () => {
        if (!selectedTags.length && !selectedCountry) return '';
        let whereClauses = [];
        let prefixes = [];
        if (selectedTags.length) {
            prefixes.push('PREFIX tag: <http://lsc.dcu.ie/tag#>');
            prefixes.push('PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            if (queryMode === 'intersection') {
                whereClauses = [
                    ...selectedTags.map(tag => `    ?s lsc:tag tag:${tag.replace(/"/g, '\"')} . `)
                ];
            } else {
                const unionFilters = selectedTags
                    .map(tag => `    { ?s lsc:tag tag:${tag.replace(/"/g, '\"')} . }`)
                    .join('\n    UNION\n');
                whereClauses = [unionFilters];
            }
        }
        if (selectedCountry) {
            if (!prefixes.includes('PREFIX lsc: <http://lsc.dcu.ie/schema#>')) {
                prefixes.push('PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            }
            whereClauses.push(`    ?s lsc:country "${selectedCountry.replace(/"/g, '\"')}" .`);
        }
        // Ensure prefixes are in a consistent order: lsc, tag
        prefixes = prefixes.sort((a, b) => a.localeCompare(b));
        return [
            ...prefixes,
            '', // empty line between prefixes and SELECT
            'SELECT DISTINCT ?s',
            'WHERE {',
            whereClauses.join('\n'),
            '}'
        ].join('\n');
    };

    // useEffect to trigger the fetch function whenever 'triggerFetch' state changes
    useEffect(() => {
        fetchImageUris();
        // eslint-disable-next-line
    }, [triggerFetch]);

    // useEffect to fetch all tags once on component mount or when forceFetchTags changes
    useEffect(() => {
        fetchAllTags(
            setAllTags,
            setLoadingTags,
            /* force */ forceFetchTags
        );
        if (forceFetchTags) {
            // Remove cache so fetchAllTags will fetch from server
            try {
                localStorage.removeItem('allLscTags');
            } catch (e) {
                // ignore
            }
            setForceFetchTags(false);
        }
        // eslint-disable-next-line
    }, [forceFetchTags]);

    // useEffect to fetch all countries once on component mount or when forceFetchCountries changes
    useEffect(() => {
        fetchAllCountries(setAllCountries, setLoadingCountries, forceFetchCountries);
        if (forceFetchCountries) setForceFetchCountries(false);
        // eslint-disable-next-line
    }, [forceFetchCountries]);

    // Handler for URI overlay
    const handleImageClick = (originalUri) => {
        setOverlayImageUrl(originalUri);
    };

    // Handler for closing the overlay
    const handleCloseOverlay = () => {
        setOverlayImageUrl(null);
    };

    // Handler for search button click
    const handleSearchClick = () => {
        // Only trigger fetch if at least one tag or a country is selected and all tags are valid
        if ((selectedTags.length > 0 && selectedTags.every(tag =>
            allTags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
        )) || selectedCountry) {
            setTriggerFetch(prev => prev + 1);
        }
    };

    // Add a handler to clear the displayed results
    const handleClearResults = () => {
        setImageUris([]);
        setError(null);
        setQueryTime(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-inter">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-7xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    LifeGraph 5
                </h1>
                <div className="flex flex-row items-start gap-8">
                    <div className="flex flex-col gap-6 max-w-xs w-full">
                        <CollapsiblePanel title="Tag Search" defaultOpen={false}>
                            <TagSelector
                                selectedTags={selectedTags}
                                setSelectedTags={setSelectedTags}
                                queryMode={queryMode}
                                setQueryMode={setQueryMode}
                                loadingTags={loadingTags}
                                setLoadingTags={setLoadingTags}
                                allTags={allTags}
                                setAllTags={setAllTags}
                                forceFetchTags={forceFetchTags}
                                setForceFetchTags={setForceFetchTags}
                                tagSearch={tagSearch}
                                setTagSearch={setTagSearch}
                                fetchAllTags={(force) => fetchAllTags(setAllTags, setLoadingTags, force)}
                            />
                        </CollapsiblePanel>
                        <CollapsiblePanel title="Country Search" defaultOpen={false}>
                            <CountrySelector
                                selectedCountry={selectedCountry}
                                setSelectedCountry={setSelectedCountry}
                                loadingCountries={loadingCountries}
                                setLoadingCountries={setLoadingCountries}
                                allCountries={allCountries}
                                setAllCountries={setAllCountries}
                                forceFetchCountries={forceFetchCountries}
                                setForceFetchCountries={setForceFetchCountries}
                                countrySearch={countrySearch}
                                setCountrySearch={setCountrySearch}
                                fetchAllCountries={(force) => fetchAllCountries(setAllCountries, setLoadingCountries, force)}
                            />
                        </CollapsiblePanel>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col items-center justify-start p-4 bg-gray-50 rounded-lg shadow-md">
                        {/* Query area at the top */}
                        <div className="w-full flex flex-col items-center mb-6">
                            <button
                                onClick={handleSearchClick}
                                className="mb-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out w-full max-w-xs"
                                disabled={loadingTags || loading || (selectedTags.length === 0 && !selectedCountry)}
                            >
                                {loadingTags ? "Loading..." : "Query"}
                            </button>
                            {/* Collapsible SPARQL Query area */}
                            <div className="w-full">
                                <button
                                    className="flex items-center gap-2 text-xs text-blue-700 hover:underline focus:outline-none mb-1"
                                    onClick={() => setShowSparql(v => !v)}
                                    type="button"
                                >
                                    {showSparql ? '▼ Hide SPARQL Query' : '► Show SPARQL Query'}
                                </button>
                                {showSparql && (
                                    <div className="w-full bg-white border border-gray-200 rounded p-2 mb-2 text-xs font-mono text-gray-700 whitespace-pre-wrap break-all">
                                        {getSparqlQuery() || <span className="text-gray-400 italic">No query constructed.</span>}
                                    </div>
                                )}
                            </div>
                            <div className="w-full flex flex-row items-center justify-center gap-4 mb-2">
                                {imageUris.length > 0 && !loading && !error && (
                                    <>
                                        <span className="text-lg font-semibold text-gray-700">{imageUris.length} result{imageUris.length !== 1 ? 's' : ''} found</span>
                                        <button
                                            className="px-3 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs"
                                            onClick={handleClearResults}
                                            disabled={loading}
                                            type="button"
                                        >
                                            Clear Results
                                        </button>
                                    </>
                                )}
                            </div>
                            {queryTime !== null && !loading && !error && (
                                <div className="w-full mb-2 text-sm text-gray-500 text-center">
                                    Query executed in {(queryTime / 1000).toFixed(1)}s
                                </div>
                            )}
                        </div>
                        {/* Results area below */}
                        <div className="w-full flex-1">
                            {loading && (
                                <div className="text-center text-blue-600">
                                    <p>Loading image URIs for selected tags...</p>
                                    <div className="mt-4 animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                                </div>
                            )}
                            {error && imageUris.length > 0 && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    <strong className="font-bold">Error!</strong>
                                    <span className="block sm:inline"> {error}</span>
                                </div>
                            )}
                            {!loading && !error && (
                                <div className="w-full">
                                    {imageUris.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {imageUris.map((uri, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-100 p-2 rounded-lg shadow flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                                    onClick={() => handleImageClick(uri)}
                                                >
                                                    <span className="break-all text-xs text-blue-700 underline">{uri}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        selectedTags.length > 0 && triggerFetch > 0
                                            ? <p className="text-center text-gray-600 text-lg">No image URIs found for selected tags.</p>
                                            : null
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* URI Overlay */}
            {overlayImageUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseOverlay}
                >
                    <div className="relative bg-white p-4 rounded-lg shadow-2xl max-w-5xl max-h-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={handleCloseOverlay}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg font-bold hover:bg-red-700 transition"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <span className="break-all text-blue-700 underline block p-4">{overlayImageUrl}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
