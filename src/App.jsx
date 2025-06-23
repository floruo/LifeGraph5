// App.jsx
import React, { useState, useEffect } from 'react';

import { FILTER_ORDER, RESULTS_PER_ROW } from './config';
import { executeSparqlQuery, fetchAllTags, fetchAllCountries, fetchDayRange, fetchAllCategories, fetchAllCities, fetchAllLocations } from './utils/sparql';

import { getTagBlock } from './components/selector/TagSelector.jsx';
import { getCountryBlock } from './components/selector/CountrySelector.jsx';
import { getCategoryBlock } from './components/selector/CategorySelector.jsx';
import { getCityBlock } from './components/selector/CitySelector.jsx';
import { getLocationBlock } from './components/selector/LocationSelector.jsx';

import { getDateBlock } from './components/filter/DateFilter.jsx';
import { getTimeBlock } from './components/filter/TimeFilter.jsx';
import { getCaptionBlock } from './components/filter/CaptionFilter.jsx';
import { getOcrBlock } from './components/filter/OcrFilter.jsx';
import { getClipSimilarityBlock } from "./components/filter/ClipFilter.jsx";

import { renderFilterPanel } from './components/RenderFilters.jsx';
import ResultOverlay from './components/ResultOverlay.jsx';
import SparqlQueryArea from "./components/SparqlQueryArea";
import ResultDisplay from './components/ResultDisplay.jsx';


// Configurable filter order
const filterOrder = FILTER_ORDER;
// Configurable number of images per row
const imagesPerRow = RESULTS_PER_ROW;

// Main App component
const App = () => {
    // State to store URIs
    const [imageUris, setImageUris] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [triggerFetch, setTriggerFetch] = useState(0);
    const [allTags, setAllTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(true);

    // Country selector state
    const [allCountries, setAllCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countrySearch, setCountrySearch] = useState('');
    const [forceFetchCountries, setForceFetchCountries] = useState(false);

    // City selector state
    const [allCities, setAllCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [selectedCity, setSelectedCity] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [forceFetchCities, setForceFetchCities] = useState(false);

    // Category selector state
    const [allCategories, setAllCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [forceFetchCategories, setForceFetchCategories] = useState(false);

    // Location selector state
    const [allLocations, setAllLocations] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [forceFetchLocations, setForceFetchLocations] = useState(false);

    // State for URI overlay
    const [overlayImageUrl, setOverlayImageUrl] = useState(null);

    // State for selected tags
    const [selectedTags, setSelectedTags] = useState([]);

    // State for tag search input in the select box
    const [tagSearch, setTagSearch] = useState('');

    // State for caption filter
    const [selectedCaption, setSelectedCaption] = useState('');

    // States for CLIP similarity filter
    const [clipSimilarityText, setClipSimilarityText] = useState('');
    const [clipSimilarityThreshold, setClipSimilarityThreshold] = useState(0.8);

    // State for OCR filter
    const [selectedOcr, setSelectedOcr] = useState('');

    // State for union/intersection mode
    const [queryMode, setQueryMode] = useState('intersection');

    // State for query execution time
    const [queryTime, setQueryTime] = useState(null);
    const [forceFetchTags, setForceFetchTags] = useState(false);

    // Collapsible state for SPARQL query
    const [showSparql, setShowSparql] = useState(false);

    // Day selector state
    const [minDate, setminDate] = useState('2019-01-01');
    const [maxDate, setmaxDate] = useState('2019-12-31');
    const [startDate, setStartDate] = useState('2019-01-01');
    const [endDate, setEndDate] = useState('2019-12-31');

    // New: Range selection state
    const [rangeType, setRangeType] = React.useState('none'); // none, 0, 1, 7, 30, custom
    const [customDays, setCustomDays] = React.useState(1);

    // Checkbox state for including day in query
    const [includeStartDay, setIncludeStartDay] = useState(false);
    const [includeEndDay, setIncludeEndDay] = useState(false);

    // State for force-refreshing day range
    const [forceFetchDayRange, setForceFetchDayRange] = useState(false);

    // State for loading day range
    const [loadingDayRange, setLoadingDayRange] = useState(false);

    // State for day-of-week filter
    const [selectedWeekdays, setSelectedWeekdays] = useState([]);

    // State for weekday range selection
    const [weekdayRange, setWeekdayRange] = useState([null, null]);

    // State for year filter (multi-select)
    const [selectedYears, setSelectedYears] = useState([]);

    // State for month filter (multi-select)
    const [selectedMonths, setSelectedMonths] = useState([]);

    // State for grouping by day (default true)
    const [groupByDay, setGroupByDay] = useState(true);

    // Time selector state
    const [minTime, setMinTime] = useState('00:00');
    const [maxTime, setMaxTime] = useState('23:59');
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('23:59');
    const [includeStartTime, setIncludeStartTime] = useState(false);
    const [includeEndTime, setIncludeEndTime] = useState(false);

    // Handler for toggling groupByDay
    const handleGroupByDayChange = (e) => {
        setGroupByDay(e.target.checked);
    };

    // State for KNN filter
    const [knnActive, setKnnActive] = useState(false);
    const [knnValue, setKnnValue] = useState(5);
    const [knnUri, setKnnUri] = useState(null);
    const [knnReplaceMode, setKnnReplaceMode] = useState(true);

    // State for KNN filter
    const [nearDuplicateActive, setNearDuplicateActive] = useState(false);
    const [nearDuplicateUri, setNearDuplicateUri] = useState(null);

    // Effect: When nearDuplicateActive is set to true, clear all other filters
    useEffect(() => {
        if (nearDuplicateActive) {
            setSelectedTags([]);
            setSelectedCountry('');
            setTagSearch('');
            setCountrySearch('');
            setCitySearch('');
            setSelectedCity('');
            setSelectedLocation('');
            setStartDate(minDate);
            setEndDate(maxDate);
            setIncludeStartDay(false);
            setIncludeEndDay(false);
            setRangeType('none');
            setCustomDays(1);
            setSelectedWeekdays([]);
            setWeekdayRange([null, null]);
            setImageUris([]);
            setError(null);
            setQueryTime(null);
            setSelectedYears([]);
            setSelectedMonths([]);
            setSelectedCategories([]);
            setStartTime(minTime);
            setEndTime(maxTime);
            setIncludeStartTime(false);
            setIncludeEndTime(false);
            setSelectedCaption('');
            setClipSimilarityText('');
            setSelectedOcr('');
            setKnnActive(false);
            //setTriggerFetch(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nearDuplicateActive]);

    // Store the latest SPARQL query for live display
    const [liveSparqlQuery, setLiveSparqlQuery] = useState('');

    // Update the live SPARQL query whenever filters or groupByDay change
    useEffect(() => {
        setLiveSparqlQuery(getSparqlQuery());
    }, [selectedTags, selectedCountry, selectedCity, selectedLocation, includeStartDay, includeEndDay, startDate, endDate, selectedWeekdays, selectedYears, queryMode, selectedMonths, selectedCategories, groupByDay, includeStartTime, includeEndTime, startTime, endTime, selectedCaption, clipSimilarityText, clipSimilarityThreshold, selectedOcr, knnActive, nearDuplicateActive]);

    // Fetch min/max day from SPARQL endpoint on mount or when forceFetchDayRange changes
    useEffect(() => {
        setLoadingDayRange(true);
        fetchDayRange(forceFetchDayRange).then(({ min, max }) => {
            setminDate(min);
            setmaxDate(max);
            setStartDate(min);
            setEndDate(max);
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
            // Map to array of { uri, id, day }
            const uris = bindings
                .map(binding => ({
                    uri: binding.img?.value,
                    id: binding.id?.value,
                    day: binding.day?.value
                }))
                .filter(obj => obj.uri);
            setImageUris(uris);
        } catch (err) {
            console.error('Error fetching image data:', err);
            setError(`Failed to fetch data: ${err.message}`);
            setQueryTime(null);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to push unique lines to an array
    function pushUnique(arr, line) {
        if (!arr.includes(line)) {
            arr.push(line);
        }
    }

    // KNN filter block
    const getKnnBlock = () => {
        if (knnActive && knnUri && knnValue > 0) {
            return `  <${knnUri}> implicit:clip${knnValue}nn ?img .`;
        }
        return '';
    };

    // nearDuplicate filter block
    const getNearDuplicateBlock = () => {
        if (nearDuplicateActive && nearDuplicateUri) {
            return `  <${nearDuplicateUri}> implicit:clipNearDuplicate ?img .`;
        }
        return '';
    };

    // Main SPARQL query builder
    const getSparqlQuery = () => {
        if (
            selectedTags.length === 0 &&
            !selectedCountry &&
            !selectedCity &&
            !includeStartDay &&
            !includeEndDay &&
            selectedWeekdays.length === 0 &&
            selectedYears.length === 0 &&
            selectedMonths.length === 0 &&
            selectedCategories.length === 0 &&
            !includeStartTime &&
            !includeEndTime &&
            !selectedLocation &&
            !selectedCaption &&
            !selectedOcr &&
            !knnActive &&
            !nearDuplicateActive &&
            !clipSimilarityText
        ) {
            return '';
        }
        let whereClauses = [];
        let prefixes = [];
        // Insert KNN block at the top of WHERE if active
        const knnBlock = getKnnBlock();
        if (knnActive && knnReplaceMode && knnBlock) {
            // Only use the KNN block, ignore other filters
            pushUnique(prefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            pushUnique(prefixes, 'PREFIX implicit: <http://megras.org/implicit/>');
            return [
                ...prefixes,
                ' ',
                'SELECT DISTINCT ?img ?id' + (groupByDay ? ' ?day' : ''),
                'WHERE {',
                '  ?img lsc:id ?id .',
                groupByDay ? '  ?img lsc:day ?day .' : '',
                knnBlock,
                '}'
            ].filter(Boolean).join('\n');
        }
        if (nearDuplicateActive && nearDuplicateUri) {
            const nearDuplicateBlock = getNearDuplicateBlock();
            if (nearDuplicateBlock) {
                whereClauses.push(nearDuplicateBlock);
                pushUnique(prefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
                pushUnique(prefixes, 'PREFIX implicit: <http://megras.org/implicit/>');
            }
        }
        if (knnBlock) {
            whereClauses.push(knnBlock);
            pushUnique(prefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            pushUnique(prefixes, 'PREFIX implicit: <http://megras.org/implicit/>');
        }
        filterOrder.forEach(type => {
            if (type === 'tags') {
                const { tagClauses, tagPrefixes } = getTagBlock(selectedTags, queryMode, pushUnique);
                whereClauses.push(...tagClauses);
                tagPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'country') {
                const { countryClauses, countryPrefixes } = getCountryBlock(selectedCountry, pushUnique);
                whereClauses.push(...countryClauses);
                countryPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'city') {
                const { cityClauses, cityPrefixes } = getCityBlock(selectedCity, pushUnique);
                whereClauses.push(...cityClauses);
                cityPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'location') {
                const { locationClauses, locationPrefixes } = getLocationBlock(selectedLocation, pushUnique);
                whereClauses.push(...locationClauses);
                locationPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'date') {
                const { dateClauses, datePrefixes } = getDateBlock(includeStartDay, includeEndDay, startDate, endDate, selectedWeekdays, selectedYears, selectedMonths, pushUnique);
                whereClauses.push(...dateClauses);
                datePrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'time') {
                const { timeClauses, timePrefixes } = getTimeBlock(includeStartTime, includeEndTime, startTime, endTime, pushUnique);
                whereClauses.push(...timeClauses);
                timePrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'category') {
                const {categoryClauses, categoryPrefixes} = getCategoryBlock(selectedCategories, pushUnique);
                whereClauses.push(...categoryClauses);
                categoryPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'caption') {
                const { captionClauses, captionPrefixes } = getCaptionBlock(selectedCaption, pushUnique);
                whereClauses.push(...captionClauses);
                captionPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'ocr') {
                const { ocrClauses, ocrPrefixes } = getOcrBlock(selectedOcr, pushUnique);
                whereClauses.push(...ocrClauses);
                ocrPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'clip') {
                const { similarityClauses, similarityPrefixes } = getClipSimilarityBlock(clipSimilarityText, clipSimilarityThreshold, pushUnique);
                whereClauses.push(...similarityClauses);
                similarityPrefixes.forEach(p => pushUnique(prefixes, p));
            }
        });
        // Only add the day triple if groupByDay is true and it is not already present from the date block
        const dayTriple = '  ?img lsc:day ?day .';
        const whereClausesString = whereClauses.join('\n');
        if (groupByDay && !whereClausesString.includes(dayTriple.trim())) {
            whereClauses.push(dayTriple);
        }
        prefixes = prefixes.sort((a, b) => a.localeCompare(b));
        // Select clause depends on groupByDay
        const selectClause = groupByDay ? 'SELECT DISTINCT ?img ?id ?day' : 'SELECT DISTINCT ?img ?id';
        return [
            ...prefixes,
            '',
            selectClause,
            'WHERE {',
            '  ?img lsc:id ?id .',
            whereClauses.join('\n'),
            '}'
        ].join('\n');
    };

    // useEffect to clear filters on initial mount or reload
    useEffect(() => {
        handleClearFilters()
    }, []);

    // useEffect to trigger the fetch function whenever 'triggerFetch' state changes
    useEffect(() => {
        fetchImageUris();
    }, [triggerFetch]);

    // useEffect to fetch all tags once on component mount or when forceFetchTags changes
    useEffect(() => {
        fetchAllTags(
            setAllTags,
            setLoadingTags,
            forceFetchTags
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
    }, [forceFetchTags]);

    // useEffect to fetch all countries
    useEffect(() => {
        fetchAllCountries(setAllCountries, setLoadingCountries, forceFetchCountries);
        if (forceFetchCountries) setForceFetchCountries(false);
    }, [forceFetchCountries]);

    // useEffect to fetch all cities from imageUris (or your data source)
    useEffect(() => {
        fetchAllCities(setAllCities, setLoadingCities, forceFetchCities);
        if (forceFetchCities) setForceFetchCities(false);
    }, [forceFetchCities]);

    // useEffect to fetch all categories
    useEffect(() => {
        fetchAllCategories(setAllCategories, setLoadingCategories, forceFetchCategories);
        if (forceFetchCategories) setForceFetchCategories(false);
    }, [forceFetchCategories]);

    // useEffect to fetch all locations
    useEffect(() => {
        fetchAllLocations(setAllLocations, setLoadingLocations, forceFetchLocations);
        if (forceFetchLocations) setForceFetchLocations(false);
    }, [forceFetchLocations]);

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
        setCitySearch('');
        setSelectedCity('');
        setSelectedLocation('');
        setStartDate(minDate);
        setEndDate(maxDate);
        setIncludeStartDay(false);
        setIncludeEndDay(false);
        setRangeType('none');
        setCustomDays(1)
        setSelectedWeekdays([]);
        setWeekdayRange([null, null]);

        setImageUris([]);
        setError(null);
        setQueryTime(null);
        setSelectedYears([]);
        setSelectedMonths([]);
        setSelectedCategories([]);
        setStartTime(minTime);
        setEndTime(maxTime);
        setIncludeStartTime(false);
        setIncludeEndTime(false);
        setSelectedCaption('');
        setClipSimilarityText('');
        setSelectedOcr('');
        setKnnActive(false);
        setNearDuplicateActive(false);
        //setTriggerFetch(0);
    };

    const [collapseAllFilters, setCollapseAllFilters] = useState(false);

    // Reset collapseAllFilters to false after triggering collapse
    useEffect(() => {
        if (collapseAllFilters) {
            setCollapseAllFilters(false);
        }
    }, [collapseAllFilters]);

    const [fullscreenResults, setFullscreenResults] = useState(false);

    // Find the index of the current image in the list
    const currentIndex = imageUris.findIndex(obj => obj.uri === overlayImageUrl);
    const showPrevImage = () => {
        if (currentIndex > 0) setOverlayImageUrl(imageUris[currentIndex - 1].uri);
    };
    const showNextImage = () => {
        if (currentIndex < imageUris.length - 1) setOverlayImageUrl(imageUris[currentIndex + 1].uri);
    };
    // Keyboard navigation for modal
    useEffect(() => {
        if (!overlayImageUrl) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'Escape') handleCloseOverlay();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [overlayImageUrl, currentIndex, imageUris]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-inter">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full h-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    LifeGraph 5
                </h1>
                <div className="flex flex-row items-start gap-8">
                    <div className="flex flex-col gap-6 max-w-xs w-full">
                        <div className="flex flex-row items-center justify-between">
                            <button
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition text-xs mr-auto"
                                onClick={() => setCollapseAllFilters(true)}
                                type="button"
                            >
                                Collapse All Filters
                            </button>
                            <button
                                className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs ml-auto"
                                onClick={handleClearFilters}
                                disabled={loading}
                                type="button"
                            >
                                Clear Filters
                            </button>
                        </div>
                        {/* Left column: Filters (configurable order) */}
                        <div className="flex flex-col gap-4">
                            {filterOrder.map(type => (
                                <React.Fragment key={type}>{renderFilterPanel(type, {
                                    allTags,
                                    loadingTags,
                                    selectedTags,
                                    setSelectedTags,
                                    tagSearch,
                                    setTagSearch,
                                    forceFetchTags,
                                    setForceFetchTags,
                                    allCountries,
                                    loadingCountries,
                                    setLoadingCountries,
                                    selectedCountry,
                                    setSelectedCountry,
                                    countrySearch,
                                    setCountrySearch,
                                    forceFetchCountries,
                                    setForceFetchCountries,
                                    allCities,
                                    loadingCities,
                                    setLoadingCities,
                                    selectedCity,
                                    setSelectedCity,
                                    citySearch,
                                    setCitySearch,
                                    forceFetchCities,
                                    setForceFetchCities,
                                    allCategories,
                                    loadingCategories,
                                    selectedCategories,
                                    setSelectedCategories,
                                    forceFetchCategories,
                                    setForceFetchCategories,
                                    selectedLocation,
                                    setSelectedLocation,
                                    locationSearch,
                                    setLocationSearch,
                                    loadingLocations,
                                    setLoadingLocations,
                                    allLocations,
                                    setAllLocations,
                                    forceFetchLocations,
                                    setForceFetchLocations,
                                    minDate,
                                    maxDate,
                                    startDate,
                                    endDate,
                                    setStartDate,
                                    setEndDate,
                                    includeStartDay,
                                    setIncludeStartDay,
                                    includeEndDay,
                                    setIncludeEndDay,
                                    fetchDayRange,
                                    forceFetchDayRange,
                                    setForceFetchDayRange,
                                    loadingDayRange,
                                    rangeType,
                                    setRangeType,
                                    customDays,
                                    setCustomDays,
                                    selectedWeekdays,
                                    setSelectedWeekdays,
                                    weekdayRange,
                                    setWeekdayRange,
                                    selectedYears,
                                    setSelectedYears,
                                    selectedMonths,
                                    setSelectedMonths,
                                    groupByDay,
                                    setGroupByDay,
                                    minTime,
                                    maxTime,
                                    startTime,
                                    endTime,
                                    setStartTime,
                                    setEndTime,
                                    includeStartTime,
                                    setIncludeStartTime,
                                    includeEndTime,
                                    setIncludeEndTime,
                                    selectedCaption,
                                    setSelectedCaption,
                                    clipSimilarityText,
                                    setClipSimilarityText,
                                    clipSimilarityThreshold,
                                    setClipSimilarityThreshold,
                                    selectedOcr,
                                    setSelectedOcr,
                                    queryMode,
                                    setQueryMode,
                                    loading,
                                    collapseAllFilters
                                })}</React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col items-center justify-start p-4 bg-gray-50 rounded-lg shadow-md">
                        {/* Query area at the top */}
                        <div className="w-full flex justify-center">
                            <div className="w-1/2 flex flex-col items-center">
                                <div className="flex flex-row items-center gap-2 w-full mb-2">
                                    <button
                                        onClick={handleSearchClick}
                                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out w-full max-w-xs"
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
                                    <label className="flex items-center text-xs ml-2">
                                        <input
                                            type="checkbox"
                                            checked={groupByDay}
                                            onChange={handleGroupByDayChange}
                                            className="mr-1"
                                        />
                                        Group by Day
                                    </label>
                                </div>
                                {/* Collapsible SPARQL Query area */}
                                <SparqlQueryArea
                                    showSparql={showSparql}
                                    setShowSparql={setShowSparql}
                                    liveSparqlQuery={liveSparqlQuery}
                                />
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
                        </div>
                        {/* Results area below */}
                        <div className="w-full flex-1">
                            <ResultDisplay
                                imageUris={imageUris}
                                loading={loading}
                                error={error}
                                groupByDay={groupByDay}
                                handleImageClick={handleImageClick}
                                triggerFetch={triggerFetch}
                                selectedTags={selectedTags}
                                overlayImageUrl={overlayImageUrl}
                                configuredImagesPerRow={imagesPerRow}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* Image Overlay */}
            <ResultOverlay
                overlayImageUrl={overlayImageUrl}
                imageUris={imageUris}
                handleCloseOverlay={handleCloseOverlay}
                setKnnActive={setKnnActive}
                setKnnUri={setKnnUri}
                knnValue={knnValue}
                setKnnValue={setKnnValue}
                knnReplaceMode={knnReplaceMode}
                setKnnReplaceMode={setKnnReplaceMode}
                setNearDuplicateActive={setNearDuplicateActive}
                setNearDuplicateUri={setNearDuplicateUri}
                showPrevImage={showPrevImage}
                showNextImage={showNextImage}
                currentIndex={currentIndex}
            />
        </div>
    );
};

export default App;
