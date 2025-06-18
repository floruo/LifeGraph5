// App.jsx
import React, { useState, useEffect } from 'react';

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

    // Your SPARQL endpoint URL for GET requests
    const sparqlEndpointUrl = 'http://localhost:8080/query/sparql';

    // Generic function to execute a SPARQL query and return the bindings
    const executeSparqlQuery = async (sparqlQuery) => {
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

    const [forceFetchTags, setForceFetchTags] = useState(false);

    // Function to fetch all distinct tags for autocomplete, with caching
    const fetchAllTags = async (force = false) => {
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

        // If not in cache or force is true, fetch from the server.
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

    const handleTagSearchChange = (event) => {
        setTagSearch(event.target.value.toLowerCase());
    };

    // Handler for tag selection from custom list

    const handleTagSelect = (tagValue) => {
        const selectedLower = tagValue.toLowerCase();
        if (selectedTags.map(st => st.toLowerCase()).includes(selectedLower)) {
            setSelectedTags(selectedTags.filter(st => st.toLowerCase() !== selectedLower));
        } else {
            setSelectedTags([...selectedTags, tagValue]);
        }
        setTagSearch('');
    };

    // Handler to remove a tag from the set
    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
    };

    // Handler for search button click
    const handleSearchClick = () => {
        // Only trigger fetch if at least one tag is selected and all are valid
        if (selectedTags.length > 0 && selectedTags.every(tag =>
            allTags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
        )) {
            setTriggerFetch(prev => prev + 1);
        }
    };

    // Ensure queryMode is reset to 'intersection' if only one or zero tags are selected
    useEffect(() => {
        if (selectedTags.length <= 1 && queryMode !== 'intersection') {
            setQueryMode('intersection');
        }
    }, [selectedTags, queryMode]);

    // Function to fetch data from the SPARQL endpoint based on the selected tags and query mode
    const fetchImageUris = async () => {
        if (!selectedTags.length) {
            setImageUris([]);
            setError(null);
            setQueryTime(null);
            return;
        }
        let sparqlQuery = '';
        if (queryMode === 'intersection') {
            // Images must have all tags
            const tagFilters = selectedTags
                .map(tag => `?s <http://lsc.dcu.ie/schema#tag> <http://lsc.dcu.ie/tag#${tag.replace(/"/g, '\\"')}> .`)
                .join('\n');
            sparqlQuery = `
                SELECT DISTINCT ?s
                WHERE {
                    ${tagFilters}
                }
            `;
        } else {
            // Union: images with any of the tags
            const unionFilters = selectedTags
                .map(tag => `{ ?s <http://lsc.dcu.ie/schema#tag> <http://lsc.dcu.ie/tag#${tag.replace(/"/g, '\\"')}> }`)
                .join(' UNION ');
            sparqlQuery = `
                SELECT DISTINCT ?s
                WHERE {
                    ${unionFilters}
                }
            `;
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
            setError(`Failed to fetch data for tags '${selectedTags.join(", ")}': ${err.message}`);
            setQueryTime(null);
        } finally {
            setLoading(false);
        }
    };

    // Function to construct the SPARQL query for display and execution
    const getSparqlQuery = () => {
        if (!selectedTags.length) return '';
        if (queryMode === 'intersection') {
            const tagFilters = selectedTags
                .map(tag => `?s <http://lsc.dcu.ie/schema#tag> <http://lsc.dcu.ie/tag#${tag.replace(/"/g, '\\"')}> .`)
                .join('\n');
            return `
SELECT DISTINCT ?s
WHERE {
${tagFilters}
}
            `.trim();
        } else {
            const unionFilters = selectedTags
                .map(tag => `{ ?s <http://lsc.dcu.ie/schema#tag> <http://lsc.dcu.ie/tag#${tag.replace(/"/g, '\\"')}> }`)
                .join(' UNION ');
            return `
SELECT DISTINCT ?s
WHERE {
${unionFilters}
}
            `.trim();
        }
    };

    // Filter tags based on search input and not already selected (case-insensitive)
    const filteredTags = allTags.filter(
        t =>
            t.toLowerCase().includes(tagSearch) &&
            !selectedTags.map(st => st.toLowerCase()).includes(t.toLowerCase())
    );

    // useEffect to trigger the fetch function whenever 'triggerFetch' state changes
    useEffect(() => {
        fetchImageUris();
        // eslint-disable-next-line
    }, [triggerFetch]);

    // useEffect to fetch all tags once on component mount or when forceFetchTags changes
    useEffect(() => {
        fetchAllTags(forceFetchTags);
        if (forceFetchTags) setForceFetchTags(false);
        // eslint-disable-next-line
    }, [forceFetchTags]);

    // Handler for URI overlay
    const handleImageClick = (originalUri) => {
        setOverlayImageUrl(originalUri);
    };

    // Handler for closing the overlay
    const handleCloseOverlay = () => {
        setOverlayImageUrl(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-inter">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    LifeGraph 5
                </h1>
                <div className="flex flex-row items-start gap-12">
                    <CollapsiblePanel title="Tag Search">
                        {/* Force fetch tags button */}
                        <div className="mb-4 w-full flex flex-row gap-2 items-center">
                            <button
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition text-xs"
                                onClick={() => setForceFetchTags(true)}
                                disabled={loadingTags}
                                type="button"
                            >
                                Refresh Tags
                            </button>
                            {loadingTags && (
                                <span className="text-xs text-gray-400 ml-2">Loading...</span>
                            )}
                        </div>
                        {/* Combined tag search and selection dropdown */}
                        <div className="mb-6 w-full relative">
                            <input
                                type="text"
                                className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-full"
                                placeholder={loadingTags ? "Loading tags..." : "Type to search or select tags"}
                                value={tagSearch}
                                onChange={handleTagSearchChange}
                                disabled={loadingTags}
                                autoComplete="off"
                            />
                            {/* Custom tag list without selector/highlighter */}
                            <div
                                className="max-h-48 overflow-y-auto border border-t-0 border-gray-300 rounded-b-md bg-white w-full"
                                style={{ marginTop: '-2px' }}
                            >
                                {loadingTags ? (
                                    <div className="p-3 text-gray-400">Loading tags...</div>
                                ) : filteredTags.length === 0 ? (
                                    <div className="p-3 text-gray-400">No tags found</div>
                                ) : (
                                    filteredTags.map((t, index) => (
                                        <div
                                            key={index}
                                            className="p-3 cursor-pointer hover:bg-blue-100 flex items-center"
                                            onClick={() => handleTagSelect(t)}
                                        >
                                            {selectedTags.map(st => st.toLowerCase()).includes(t.toLowerCase()) ? (
                                                <span className="mr-2 text-green-600">✔</span>
                                            ) : null}
                                            {t.replace(/_/g, ' ').toLowerCase()}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        {/* AND/OR toggle, only if more than one tag is selected */}
                        {selectedTags.length > 1 && (
                            <div className="mb-4 flex w-full gap-2">
                                <button
                                    className={`flex-1 flex items-center justify-center px-2 py-1 rounded ${queryMode === 'intersection' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setQueryMode('intersection')}
                                    title="Intersection (AND): Only images with all tags"
                                    type="button"
                                >
                                    AND
                                </button>
                                <button
                                    className={`flex-1 flex items-center justify-center px-2 py-1 rounded ${queryMode === 'union' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setQueryMode('union')}
                                    title="Union (OR): Images with any tag"
                                    type="button"
                                >
                                    OR
                                </button>
                            </div>
                        )}
                        {/* Display selected tags as a set */}
                        <div className="mb-4 flex flex-wrap gap-2">
                            {selectedTags.map((t, idx) => (
                                <span
                                    key={t}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                                >
                                    {t.replace(/_/g, ' ').toLowerCase()}
                                    <button
                                        className="ml-2 text-blue-500 hover:text-red-600 font-bold"
                                        onClick={() => handleRemoveTag(t)}
                                        title="Remove tag"
                                        type="button"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </CollapsiblePanel>
                    <div className="flex-[2_2_0%] min-w-0 flex flex-col items-center justify-start p-4 bg-gray-50 rounded-lg shadow-md">
                        {/* Query button at the top */}
                        <button
                            onClick={handleSearchClick}
                            className="mb-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out w-full max-w-xs"
                            disabled={loadingTags || loading || selectedTags.length === 0}
                        >
                            {loadingTags ? "Loading..." : "Query"}
                        </button>
                        {/* Show count of results at the top */}
                        <div className="w-full mb-4 text-lg font-semibold text-gray-700 text-center">
                            {imageUris.length > 0 && !loading && !error && (
                                <span>{imageUris.length} result{imageUris.length !== 1 ? 's' : ''} found</span>
                            )}
                        </div>
                        {/* Show query execution time */}
                        {queryTime !== null && !loading && !error && (
                            <div className="w-full mb-4 text-sm text-gray-500 text-center">
                                Query executed in {(queryTime / 1000).toFixed(1)}s
                            </div>
                        )}
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
                                    // Only show the "No image URIs found" message if tags are selected and a search was triggered
                                    selectedTags.length > 0 && triggerFetch > 0
                                        ? <p className="text-center text-gray-600 text-lg">No image URIs found for selected tags. Please check your SPARQL endpoint and query.</p>
                                        : null
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Collapsible Placeholder for future use */}
                    <CollapsiblePanel title="SPARQL Query" defaultOpen={false}>
                        <div className="w-full h-full flex items-start justify-center text-gray-700 font-mono text-xs whitespace-pre-wrap break-all">
                            {getSparqlQuery() || <span className="text-gray-400 italic">No query constructed.</span>}
                        </div>
                    </CollapsiblePanel>
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
