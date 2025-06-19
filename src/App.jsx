// App.jsx
import React, { useState, useEffect } from 'react';
import TagSelector from './components/TagSelector';
import CountrySelector from './components/CountrySelector';
import DateSelector from './components/DateSelector.jsx';
import CategorySelector from './components/CategorySelector';
import { executeSparqlQuery, fetchAllTags, fetchAllCountries, fetchDayRange, fetchAllCategories } from './utils/sparql';

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

    // Category selector state
    const [allCategories, setAllCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);

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

    // Day selector state
    const [minDay, setMinDay] = useState('2019-01-01');
    const [maxDay, setMaxDay] = useState('2019-12-31');
    const [startDay, setStartDay] = useState('2019-01-01');
    const [endDay, setEndDay] = useState('2019-12-31');

    // Checkbox state for including day in query
    const [includeStartDay, setIncludeStartDay] = useState(false);
    const [includeEndDay, setIncludeEndDay] = useState(false);

    // State for force-refreshing day range
    const [forceFetchDayRange, setForceFetchDayRange] = useState(false);

    // State for loading day range
    const [loadingDayRange, setLoadingDayRange] = useState(false);

    // State for day-of-week filter
    const [selectedWeekdays, setSelectedWeekdays] = useState([]); // e.g., ['Monday', 'Tuesday']

    // State for weekday range selection
    const [weekdayRange, setWeekdayRange] = useState([null, null]);

    // State for year filter (multi-select)
    const [selectedYears, setSelectedYears] = useState([]);

    // State for month filter (multi-select)
    const [selectedMonths, setSelectedMonths] = useState([]);

    // Store the latest SPARQL query for live display
    const [liveSparqlQuery, setLiveSparqlQuery] = useState('');

    // Update the live SPARQL query whenever filters change
    useEffect(() => {
        setLiveSparqlQuery(getSparqlQuery());
    }, [selectedTags, selectedCountry, includeStartDay, includeEndDay, startDay, endDay, selectedWeekdays, selectedYears, queryMode, selectedMonths, selectedCategories]);

    // Fetch min/max day from SPARQL endpoint on mount or when forceFetchDayRange changes
    useEffect(() => {
        setLoadingDayRange(true);
        fetchDayRange(forceFetchDayRange).then(({ min, max }) => {
            setMinDay(min);
            setMaxDay(max);
            setStartDay(min);
            setEndDay(max);
            setLoadingDayRange(false);
        });
        if (forceFetchDayRange) setForceFetchDayRange(false);
    }, [forceFetchDayRange]);

    // Ensure queryMode is reset to 'intersection' if only one or zero tags are selected
    useEffect(() => {
        if (selectedTags.length <= 1 && queryMode !== 'intersection') {
            setQueryMode('intersection');
        }
    }, [selectedTags, queryMode]);

    // Function to fetch data from the SPARQL endpoint based on the constructed query
    const fetchImageUris = async () => {
        const sparqlQuery = getSparqlQuery();
        // Always update the query area when query changes
        setShowSparql(true);
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
        // If no filters are selected, return an empty string
        if (
            selectedTags.length === 0 &&
            !selectedCountry &&
            !includeStartDay &&
            !includeEndDay &&
            selectedWeekdays.length === 0 &&
            selectedYears.length === 0 &&
            selectedMonths.length === 0 &&
            selectedCategories.length === 0
        ) {
            return '';
        }
        let whereClauses = [];
        let prefixes = [];
        // Tag filter block
        if (selectedTags.length) {
            prefixes.push('PREFIX tag: <http://lsc.dcu.ie/tag#>');
            prefixes.push('PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            if (queryMode === 'intersection') {
                whereClauses.push(`  {\n${selectedTags.map(tag => `    ?s lsc:tag tag:${tag.replace(/"/g, '\"')} . `).join('\n')}\n  }`);
            } else {
                const unionFilters = selectedTags
                    .map(tag => `    { ?s lsc:tag tag:${tag.replace(/"/g, '\"')} . }`)
                    .join('\n    UNION\n');
                whereClauses.push(`  {\n${unionFilters}\n  }`);
            }
        }
        // Country filter block
        if (selectedCountry) {
            if (!prefixes.includes('PREFIX lsc: <http://lsc.dcu.ie/schema#>')) {
                prefixes.push('PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            }
            whereClauses.push(`  {\n    ?s lsc:country \"${selectedCountry.replace(/"/g, '\"')}\" .\n  }`);
        }
        // Date, Year, Month, Weekday: group in one block
        if (
            includeStartDay || includeEndDay ||
            selectedWeekdays.length > 0 ||
            selectedYears.length > 0 ||
            selectedMonths.length > 0
        ) {
            if (!prefixes.includes('PREFIX lsc: <http://lsc.dcu.ie/schema#>')) {
                prefixes.push('PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            }
            if (!prefixes.includes('PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>')) {
                prefixes.push('PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>');
            }
            if (selectedWeekdays.length > 0 && !prefixes.includes('PREFIX megras: <http://megras.org/sparql#>')) {
                prefixes.push('PREFIX megras: <http://megras.org/sparql#>');
            }
            let dateBlock = [
                '    ?s lsc:day ?day .',
                '    BIND(xsd:date(STRAFTER(STR(?day), "#")) AS ?dayDate)'
            ];
            // Date range
            if (includeStartDay && includeEndDay) {
                dateBlock.push(`    FILTER (?dayDate >= \"${startDay}\"^^xsd:date && ?dayDate <= \"${endDay}\"^^xsd:date)`);
            } else if (includeStartDay) {
                dateBlock.push(`    FILTER (?dayDate >= \"${startDay}\"^^xsd:date)`);
            } else if (includeEndDay) {
                dateBlock.push(`    FILTER (?dayDate <= \"${endDay}\"^^xsd:date)`);
            }
            // Weekday
            if (selectedWeekdays.length > 0) {
                const weekdayMap = {
                    'Monday': 1,
                    'Tuesday': 2,
                    'Wednesday': 3,
                    'Thursday': 4,
                    'Friday': 5,
                    'Saturday': 6,
                    'Sunday': 7
                };
                const selectedNumbers = selectedWeekdays.map(day => weekdayMap[day]);
                dateBlock.push(`    FILTER (megras:DAYOFWEEK(?dayDate) IN (${selectedNumbers.join(", ")}))`);
            }
            // Year
            if (selectedYears.length > 0) {
                const yearFilters = selectedYears.map(y => `YEAR(?dayDate) = ${y}`).join(' || ');
                dateBlock.push(`    FILTER (${yearFilters})`);
            }
            // Month
            if (selectedMonths.length > 0) {
                dateBlock.push(`    FILTER (MONTH(?dayDate) IN (${selectedMonths.join(", ")}))`);
            }
            whereClauses.push(`  {\n${dateBlock.join('\n')}\n  }`);
        }
        // Category filter block
        if (selectedCategories.length) {
            prefixes.push('PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            // Always use union logic for categories (OR)
            const unionFilters = selectedCategories
                .map(cat => `    { ?s lsc:category "${cat.replace(/"/g, '\"')}" . }`)
                .join('\n    UNION\n');
            whereClauses.push(`  {\n${unionFilters}\n  }`);
        }
        prefixes = prefixes.sort((a, b) => a.localeCompare(b));
        return [
            ...prefixes,
            '',
            'SELECT DISTINCT ?s',
            'WHERE {',
            whereClauses.join('\n'),
            '}'
        ].join('\n');
    };

    // useEffect to clear filters on initial mount
    useEffect(() => {
        setSelectedTags([]);
        setSelectedCountry('');
        setTagSearch('');
        setCountrySearch('');
        setStartDay(minDay);
        setEndDay(maxDay);
        setIncludeStartDay(false);
        setIncludeEndDay(false);
        setSelectedWeekdays([]);
        setWeekdayRange([null, null]);
        setImageUris([]);
        setError(null);
        setQueryTime(null);
        // Do not trigger fetch on mount
    }, []);

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

    // useEffect to fetch all categories once on component mount
    useEffect(() => {
        fetchAllCategories(setAllCategories, setLoadingCategories);
    }, []);

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
        // Always trigger fetch, regardless of filter state
        setTriggerFetch(prev => prev + 1);
    };

    // Add a handler to clear the displayed results
    const handleClearResults = () => {
        setImageUris([]);
        setError(null);
        setQueryTime(null);
    };

    // Add a handler to clear all query filters
    const handleClearFilters = () => {
        setSelectedTags([]);
        setSelectedCountry('');
        setTagSearch('');
        setCountrySearch('');
        setStartDay(minDay);
        setEndDay(maxDay);
        setIncludeStartDay(false);
        setIncludeEndDay(false);
        setSelectedWeekdays([]);
        setWeekdayRange([null, null]);
        setImageUris([]);
        setError(null);
        setQueryTime(null);
        setSelectedYears([]);
        setSelectedMonths([]);
        setSelectedCategories([]); // Clear categories as well
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-inter">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-7xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    LifeGraph 5
                </h1>
                <div className="flex flex-row items-start gap-8">
                    <div className="flex flex-col gap-6 max-w-xs w-full">
                        <div className="flex flex-row items-center justify-between">
                            <button
                                className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs ml-auto"
                                onClick={handleClearFilters}
                                disabled={loading}
                                type="button"
                            >
                                Clear Filters
                            </button>
                        </div>
                        <CollapsiblePanel title="Tag Filter" defaultOpen={false}>
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
                        <CollapsiblePanel title="Country Filter" defaultOpen={false}>
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
                        <CollapsiblePanel title="Date Filter" defaultOpen={false}>
                            <DateSelector
                                minDate={minDay}
                                maxDate={maxDay}
                                startDate={startDay}
                                endDate={endDay}
                                setStartDate={setStartDay}
                                setEndDate={setEndDay}
                                includeStartDay={includeStartDay}
                                setIncludeStartDay={setIncludeStartDay}
                                includeEndDay={includeEndDay}
                                setIncludeEndDay={setIncludeEndDay}
                                onRefreshDayRange={() => setForceFetchDayRange(true)}
                                onDayChange={() => setTriggerFetch(prev => prev + 1)}
                                selectedWeekdays={selectedWeekdays}
                                setSelectedWeekdays={setSelectedWeekdays}
                                weekdayRange={weekdayRange}
                                setWeekdayRange={setWeekdayRange}
                                selectedYears={selectedYears}
                                setSelectedYears={setSelectedYears}
                                selectedMonths={selectedMonths}
                                setSelectedMonths={setSelectedMonths}
                                loadingDayRange={loadingDayRange}
                            />
                        </CollapsiblePanel>
                        <CollapsiblePanel title="Category Filter" defaultOpen={false}>
                            <CategorySelector
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                loading={loadingCategories}
                                categories={allCategories}
                                fetchAllCategories={(force) => fetchAllCategories(setAllCategories, setLoadingCategories, force)}
                            />
                        </CollapsiblePanel>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col items-center justify-start p-4 bg-gray-50 rounded-lg shadow-md">
                        {/* Query area at the top */}
                        <div className="w-full flex flex-col items-center mb-6">
                            <button
                                onClick={handleSearchClick}
                                className="mb-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out w-full max-w-xs"
                                disabled={
                                    loadingTags ||
                                    loading ||
                                    (
                                        !getSparqlQuery()
                                    )
                                }
                            >
                                {loadingTags ? "Loading ..." : "Query"}
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
                                        {liveSparqlQuery || <span className="text-gray-400 italic">No query constructed.</span>}
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
