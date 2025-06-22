// App.jsx
import React, { useState, useEffect } from 'react';
import TagSelector from './components/TagSelector';
import CountrySelector from './components/CountrySelector';
import DateSelector from './components/DateSelector.jsx';
import CategorySelector from './components/CategorySelector';
import CitySelector from './components/CitySelector';
import TimeSelector from './components/TimeSelector';
import LocationSelector from './components/LocationSelector';
import CaptionFilter from './components/CaptionFilter';
import OcrFilter from './components/OcrFilter';
import { executeSparqlQuery, fetchAllTags, fetchAllCountries, fetchDayRange, fetchAllCategories, fetchAllCities, fetchAllLocations } from './utils/sparql';
import { FILTER_ORDER } from './config';

// Configurable filter order
const filterOrder = FILTER_ORDER;

// CollapsiblePanel component for left/right columns
const CollapsiblePanel = ({ title, children, defaultOpen = false, className = "", forceCollapse }) => {
    const [open, setOpen] = useState(defaultOpen);
    useEffect(() => {
        if (forceCollapse === true) setOpen(false);
    }, [forceCollapse]);
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
    const [selectedLocation, setSelectedLocation] = useState('');
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [allLocations, setAllLocations] = useState([]);
    const [locationSearch, setLocationSearch] = useState('');

    // State for URI overlay
    const [overlayImageUrl, setOverlayImageUrl] = useState(null);

    // State for selected tags
    const [selectedTags, setSelectedTags] = useState([]); // Array of selected tags

    // State for tag search input in the select box
    const [tagSearch, setTagSearch] = useState('');

    // State for caption filter
    const [selectedCaption, setSelectedCaption] = useState('');

    // State for OCR filter
    const [selectedOcr, setSelectedOcr] = useState('');

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
    const [knnValue, setKnnValue] = useState(5); // Default k=5
    const [knnUri, setKnnUri] = useState(null);
    const [knnReplaceMode, setKnnReplaceMode] = useState(false); // New state for replace mode

    // Store the latest SPARQL query for live display
    const [liveSparqlQuery, setLiveSparqlQuery] = useState('');

    // Update the live SPARQL query whenever filters or groupByDay change
    useEffect(() => {
        setLiveSparqlQuery(getSparqlQuery());
    }, [selectedTags, selectedCountry, selectedCity, selectedLocation, includeStartDay, includeEndDay, startDay, endDay, selectedWeekdays, selectedYears, queryMode, selectedMonths, selectedCategories, groupByDay, includeStartTime, includeEndTime, startTime, endTime, selectedCaption, selectedOcr, knnActive]);

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
                    uri: binding.s?.value,
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
    const pushUnique = (arr, line) => {
        if (!arr.includes(line)) {
            arr.push(line);
        }
    };

    // Tag filter block
    const getTagBlock = () => {
        let tagClauses = [];
        let tagPrefixes = [];
        if (selectedTags.length) {
            pushUnique(tagPrefixes, 'PREFIX tag: <http://lsc.dcu.ie/tag#>');
            pushUnique(tagPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            if (queryMode === 'intersection') {
                tagClauses.push(`  {\n${selectedTags.map(tag => `    ?s lsc:tag tag:${tag.replace(/\"/g, '\\"')} . `).join('\n')}\n  }`);
            } else {
                const unionFilters = selectedTags
                    .map(tag => `    { ?s lsc:tag tag:${tag.replace(/\"/g, '\\"')} . }`)
                    .join('\n    UNION\n');
                tagClauses.push(`  {\n${unionFilters}\n  }`);
            }
        }
        return { tagClauses, tagPrefixes };
    };

    // Country filter block
    const getCountryBlock = () => {
        let countryClauses = [];
        let countryPrefixes = [];
        if (selectedCountry) {
            pushUnique(countryPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            countryClauses.push(`  {\n    ?s lsc:country \"${selectedCountry.replace(/\"/g, '\\"')}\" .\n  }`);
        }
        return { countryClauses, countryPrefixes };
    };

    // City filter block
    const getCityBlock = () => {
        let cityClauses = [];
        let cityPrefixes = [];
        if (selectedCity) {
            pushUnique(cityPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            cityClauses.push(`  {\n    ?s lsc:city \"${selectedCity.replace(/\"/g, '\\"')}\" .\n  }`);
        }
        return { cityClauses, cityPrefixes };
    };

    // Location filter block
    const getLocationBlock = () => {
        let locationClauses = [];
        let locationPrefixes = [];
        if (selectedLocation) {
            pushUnique(locationPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            locationClauses.push(`  {\n    ?s lsc:location_name \"${selectedLocation.replace(/\"/g, '\\"')}\" .\n  }`);
        }
        return { locationClauses, locationPrefixes };
    };

    // Date, Year, Month, Weekday block
    const getDateBlock = () => {
        let dateClauses = [];
        let datePrefixes = [];
        if (
            includeStartDay || includeEndDay ||
            selectedWeekdays.length > 0 ||
            selectedYears.length > 0 ||
            selectedMonths.length > 0
        ) {
            pushUnique(datePrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            pushUnique(datePrefixes, 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>');
            if (selectedWeekdays.length > 0) {
                pushUnique(datePrefixes, 'PREFIX megras: <http://megras.org/sparql#>');
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
            dateClauses.push(`  {\n${dateBlock.join('\n')}\n  }`);
        }
        return { dateClauses, datePrefixes };
    };

    // Time filter block
    const getTimeBlock = () => {
        let timeClauses = [];
        let timePrefixes = [];
        if (includeStartTime || includeEndTime) {
            pushUnique(timePrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            let filter = [];
            // Extract time part from datetime string (format: 2019-07-09 07:47:08^^String)
            // BIND(SUBSTR(STR(?datetime), 12, 8) AS ?time)
            if (includeStartTime && includeEndTime) {
                filter.push(`?time >= \"${startTime.length === 5 ? startTime + ':00' : startTime}\" && ?time <= \"${endTime.length === 5 ? endTime + ':00' : endTime}\"`);
            } else if (includeStartTime) {
                filter.push(`?time >= \"${startTime.length === 5 ? startTime + ':00' : startTime}\"`);
            } else if (includeEndTime) {
                filter.push(`?time <= \"${endTime.length === 5 ? endTime + ':00' : endTime}\"`);
            }
            timeClauses.push(`  {\n    ?s lsc:local_time ?datetime .\n    BIND(SUBSTR(STR(?datetime), 12, 8) AS ?time)\n    FILTER (${filter.join(' && ')})\n  }`);
        }
        return { timeClauses, timePrefixes };
    };

    // Category filter block
    const getCategoryBlock = () => {
        let categoryClauses = [];
        let categoryPrefixes = [];
        if (selectedCategories.length) {
            pushUnique(categoryPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            // Always use union logic for categories (OR)
            const unionFilters = selectedCategories
                .map(cat => `    { ?s lsc:category \"${cat.replace(/\"/g, '\\"')}\" . }`)
                .join('\n    UNION\n');
            categoryClauses.push(`  {\n${unionFilters}\n  }`);
        }
        return { categoryClauses, categoryPrefixes };
    };

    // Caption filter block
    const getCaptionBlock = () => {
        let captionClauses = [];
        let captionPrefixes = [];
        if (selectedCaption) {
            pushUnique(captionPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            // The triple: ?s lsc:caption ?caption .
            // Filter: case-insensitive substring match
            captionClauses.push(`  {\n    ?s lsc:caption ?caption .\n    FILTER(CONTAINS(LCASE(STR(?caption)), LCASE(\"${selectedCaption.replace(/"/g, '\\"')}\")))\n  }`);
        }
        return { captionClauses, captionPrefixes };
    };

    // OCR filter block
    const getOcrBlock = () => {
        let ocrClauses = [];
        let ocrPrefixes = [];
        if (selectedOcr) {
            pushUnique(ocrPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
            ocrClauses.push(`  {\n    ?s lsc:ocr ?ocr .\n    FILTER(CONTAINS(LCASE(STR(?ocr)), LCASE(\"${selectedOcr.replace(/\"/g, '\\\"')}\")))\n  }`);
        }
        return { ocrClauses, ocrPrefixes };
    };

    // KNN filter block
    const getKnnBlock = () => {
        if (knnActive && knnUri && knnValue > 0) {
            return `  <${knnUri}> implicit:clip${knnValue}nn ?s .`;
        }
        return '';
    };

    // Helper to render filter panels by type
    const renderFilterPanel = (type) => {
        switch (type) {
            case 'tags':
                return (
                    <CollapsiblePanel title="Tags" forceCollapse={collapseAllFilters}>
                        <TagSelector
                            allTags={allTags}
                            loadingTags={loadingTags}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                            tagSearch={tagSearch}
                            setTagSearch={setTagSearch}
                            forceFetchTags={forceFetchTags}
                            setForceFetchTags={setForceFetchTags}
                            fetchAllTags={(force = false) => setForceFetchTags(force)}
                            queryMode={queryMode}
                            setQueryMode={setQueryMode}
                        />
                    </CollapsiblePanel>
                );
            case 'country':
                return (
                    <CollapsiblePanel title="Country" forceCollapse={collapseAllFilters}>
                        <CountrySelector
                            allCountries={allCountries}
                            loadingCountries={loadingCountries}
                            setLoadingCountries={setLoadingCountries}
                            selectedCountry={selectedCountry}
                            setSelectedCountry={setSelectedCountry}
                            countrySearch={countrySearch}
                            setCountrySearch={setCountrySearch}
                            forceFetchCountries={forceFetchCountries}
                            setForceFetchCountries={setForceFetchCountries}
                            fetchAllCountries={(force = false) => setForceFetchCountries(force)}
                        />
                    </CollapsiblePanel>
                );
            case 'city':
                return (
                    <CollapsiblePanel title="City" forceCollapse={collapseAllFilters}>
                        <CitySelector
                            allCities={allCities}
                            loadingCities={loadingCities}
                            setLoadingCities={setLoadingCities}
                            selectedCity={selectedCity}
                            setSelectedCity={setSelectedCity}
                            citySearch={citySearch}
                            setCitySearch={setCitySearch}
                            fetchAllCities={(force = false) => setForceFetchCities(force)}
                        />
                    </CollapsiblePanel>
                );
            case 'date':
                return (
                    <CollapsiblePanel title="Date" forceCollapse={collapseAllFilters}>
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
                );
            case 'time':
                return (
                    <CollapsiblePanel title="Time" forceCollapse={collapseAllFilters}>
                        <TimeSelector
                            minTime={minTime}
                            maxTime={maxTime}
                            startTime={startTime}
                            endTime={endTime}
                            setStartTime={setStartTime}
                            setEndTime={setEndTime}
                            includeStartTime={includeStartTime}
                            setIncludeStartTime={setIncludeStartTime}
                            includeEndTime={includeEndTime}
                            setIncludeEndTime={setIncludeEndTime}
                        />
                    </CollapsiblePanel>
                );
            case 'category':
                return (
                    <CollapsiblePanel title="Category" forceCollapse={collapseAllFilters}>
                        <CategorySelector
                            categories={allCategories}
                            loading={loadingCategories}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            fetchAllCategories={(force = false) => setForceFetchCategories(force)}
                        />
                    </CollapsiblePanel>
                );
            case 'location':
                return (
                    <CollapsiblePanel title="Location" forceCollapse={collapseAllFilters}>
                        <LocationSelector
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                            loadingLocations={loadingLocations}
                            setLoadingLocations={setLoadingLocations}
                            allLocations={allLocations}
                            setAllLocations={setAllLocations}
                            locationSearch={locationSearch}
                            setLocationSearch={setLocationSearch}
                            fetchAllLocations={(force) => fetchAllLocations(setAllLocations, setLoadingLocations, force)}
                        />
                    </CollapsiblePanel>
                );
            case 'caption':
                return (
                    <CollapsiblePanel title="Caption" forceCollapse={collapseAllFilters}>
                        <CaptionFilter
                            selectedCaption={selectedCaption}
                            setSelectedCaption={setSelectedCaption}
                            loading={loading}
                        />
                    </CollapsiblePanel>
                );
            case 'ocr':
                return (
                    <CollapsiblePanel title="OCR" forceCollapse={collapseAllFilters}>
                        <OcrFilter
                            selectedOcr={selectedOcr}
                            setSelectedOcr={setSelectedOcr}
                            loading={loading}
                        />
                    </CollapsiblePanel>
                );
            default:
                return null;
        }
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
            !knnActive
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
                '',
                'SELECT DISTINCT ?s ?id' + (groupByDay ? ' ?day' : ''),
                'WHERE {',
                '  ?s lsc:id ?id .',
                groupByDay ? '  ?s lsc:day ?day .' : '',
                knnBlock,
                '}'
            ].filter(Boolean).join('\n');
        }
        if (knnBlock) {
            whereClauses.push(knnBlock);
            pushUnique(prefixes, 'PREFIX implicit: <http://megras.org/implicit/>');
        }
        filterOrder.forEach(type => {
            if (type === 'tags') {
                const { tagClauses, tagPrefixes } = getTagBlock();
                whereClauses.push(...tagClauses);
                tagPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'country') {
                const { countryClauses, countryPrefixes } = getCountryBlock();
                whereClauses.push(...countryClauses);
                countryPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'city') {
                const { cityClauses, cityPrefixes } = getCityBlock();
                whereClauses.push(...cityClauses);
                cityPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'location') {
                const { locationClauses, locationPrefixes } = getLocationBlock();
                whereClauses.push(...locationClauses);
                locationPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'date') {
                const { dateClauses, datePrefixes } = getDateBlock();
                whereClauses.push(...dateClauses);
                datePrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'time') {
                const { timeClauses, timePrefixes } = getTimeBlock();
                whereClauses.push(...timeClauses);
                timePrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'category') {
                const {categoryClauses, categoryPrefixes} = getCategoryBlock();
                whereClauses.push(...categoryClauses);
                categoryPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'caption') {
                const { captionClauses, captionPrefixes } = getCaptionBlock();
                whereClauses.push(...captionClauses);
                captionPrefixes.forEach(p => pushUnique(prefixes, p));
            } else if (type === 'ocr') {
                const { ocrClauses, ocrPrefixes } = getOcrBlock();
                whereClauses.push(...ocrClauses);
                ocrPrefixes.forEach(p => pushUnique(prefixes, p));
            }
        });
        // Only add the day triple if groupByDay is true and it is not already present from the date block
        const dayTriple = '  ?s lsc:day ?day .';
        const whereClausesString = whereClauses.join('\n');
        if (groupByDay && !whereClausesString.includes(dayTriple.trim())) {
            whereClauses.push(dayTriple);
        }
        prefixes = prefixes.sort((a, b) => a.localeCompare(b));
        // Select clause depends on groupByDay
        const selectClause = groupByDay ? 'SELECT DISTINCT ?s ?id ?day' : 'SELECT DISTINCT ?s ?id';
        return [
            ...prefixes,
            '',
            selectClause,
            'WHERE {',
            '  ?s lsc:id ?id .',
            whereClauses.join('\n'),
            '}'
        ].join('\n');
    };

    // useRef to prevent fetch on initial mount or reload
    const didMount = React.useRef(false);

    // useEffect to clear filters on initial mount or reload
    useEffect(() => {
        handleClearFilters()
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

    // useEffect to fetch all cities from imageUris (or your data source)
    useEffect(() => {
        fetchAllCities(setAllCities, setLoadingCities, forceFetchCities);
        if (forceFetchCities) setForceFetchCities(false);
        // eslint-disable-next-line
    }, [forceFetchCities]);

    // useEffect to fetch all categories once on component mount
    useEffect(() => {
        fetchAllCategories(setAllCategories, setLoadingCategories, forceFetchCategories);
        if (forceFetchCategories) setForceFetchCategories(false);
    }, [forceFetchCategories]);

    // useEffect to fetch all locations once on component mount
    useEffect(() => {
        fetchAllLocations(setAllLocations, setLoadingLocations);
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
        setCitySearch('');
        setSelectedCity('');
        setSelectedLocation('');
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
        setSelectedCategories([]);
        setStartTime(minTime);
        setEndTime(maxTime);
        setIncludeStartTime(false);
        setIncludeEndTime(false);
        setSelectedCaption('');
        setSelectedOcr('');
        setKnnActive(false);
        setTriggerFetch(0); // Reset triggerFetch so 'no results' message vanishes
    };

    const [collapseAllFilters, setCollapseAllFilters] = useState(false);
    const [filtersCollapsed, setFiltersCollapsed] = useState(false);

    // Reset collapseAllFilters to false after triggering collapse
    useEffect(() => {
        if (collapseAllFilters) {
            setCollapseAllFilters(false);
        }
    }, [collapseAllFilters]);

    const [fullscreenResults, setFullscreenResults] = useState(false);

    // Helper to group imageUris by year, month, day (with correct ordering)
    function groupByYearMonthDay(imageUris) {
        const groups = {};
        imageUris.forEach(obj => {
            let dateStr = obj.day ? obj.day.replace('http://lsc.dcu.ie/day#', '') : 'Unknown Day';
            let year = 'Unknown Year', month = 'Unknown Month', day = 'Unknown Day';
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                [year, month, day] = dateStr.split('-');
            } else if (/^\d{4}-\d{2}$/.test(dateStr)) {
                [year, month] = dateStr.split('-');
            } else if (/^\d{4}$/.test(dateStr)) {
                year = dateStr;
            }
            if (!groups[year]) groups[year] = {};
            if (!groups[year][month]) groups[year][month] = {};
            if (!groups[year][month][dateStr]) groups[year][month][dateStr] = [];
            groups[year][month][dateStr].push(obj.uri);
        });
        return groups;
    }

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
                                <React.Fragment key={type}>{renderFilterPanel(type)}</React.Fragment>
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
                        </div>
                        {/* Results area below */}
                        <div className={`w-full flex-1${fullscreenResults ? ' fixed inset-0 z-50 bg-white p-8 overflow-auto' : ''}`}>
                            {imageUris.length > 0 && (
                                <div className="w-full flex justify-end mb-2 gap-2">
                                    <button
                                        className={`px-3 py-1 rounded shadow text-xs transition ${fullscreenResults ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                        onClick={() => setFullscreenResults(f => !f)}
                                        type="button"
                                    >
                                        {fullscreenResults ? 'Exit Fullscreen' : 'Fullscreen Results'}
                                    </button>
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
                            {!loading && !error && imageUris.length === 0 && triggerFetch > 0 && (
                                <div className="w-full flex flex-col items-center justify-center py-12">
                                    <p className="text-center text-gray-600 text-lg">No results found.</p>
                                </div>
                            )}
                            {!loading && !error && (
                                <div className="w-full">
                                    {imageUris.length > 0 ? (
                                        groupByDay ? (
                                            (() => {
                                                const groups = groupByYearMonthDay(imageUris);
                                                const years = Object.keys(groups);
                                                // Helper to render days
                                                const renderDays = (daysObj) => {
                                                    const days = Object.keys(daysObj);
                                                    if (days.length > 1) {
                                                        return days.map(day => (
                                                            <CollapsiblePanel key={day} title={day} defaultOpen={false} className="w-full !max-w-none">
                                                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                    {daysObj[day].map((uri, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="bg-gray-100 p-2 rounded-lg shadow flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                                                            onClick={() => handleImageClick(uri)}
                                                                        >
                                                                            <img
                                                                                src={uri + "/preview"}
                                                                                alt="Preview"
                                                                                className="max-h-32 max-w-full object-contain rounded shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                                                                                onClick={e => { e.stopPropagation(); handleImageClick(uri); }}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </CollapsiblePanel>
                                                        ));
                                                    } else if (days.length === 1) {
                                                        return (
                                                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                {daysObj[days[0]].map((uri, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="bg-gray-100 p-2 rounded-lg shadow flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                                                        onClick={() => handleImageClick(uri)}
                                                                    >
                                                                        <img
                                                                            src={uri + "/preview"}
                                                                            alt="Preview"
                                                                            className="max-h-32 max-w-full object-contain rounded shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                                                                            onClick={e => { e.stopPropagation(); handleImageClick(uri); }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                };
                                                // Helper to render months
                                                const renderMonths = (monthsObj) => {
                                                    // Sort months as numbers if possible, fallback to string
                                                    const months = Object.keys(monthsObj).sort((a, b) => {
                                                        // Try to parse as month (01-12)
                                                        const aNum = /^\d{2}$/.test(a) ? parseInt(a, 10) : a;
                                                        const bNum = /^\d{2}$/.test(b) ? parseInt(b, 10) : b;
                                                        if (typeof aNum === 'number' && typeof bNum === 'number') {
                                                            return aNum - bNum;
                                                        }
                                                        return String(a).localeCompare(String(b));
                                                    });
                                                    if (months.length > 1) {
                                                        return months.map(month => (
                                                            <CollapsiblePanel key={month} title={month} defaultOpen={false} className="w-full !max-w-none">
                                                                {renderDays(monthsObj[month])}
                                                            </CollapsiblePanel>
                                                        ));
                                                    } else if (months.length === 1) {
                                                        return renderDays(monthsObj[months[0]]);
                                                    } else {
                                                        return null;
                                                    }
                                                };
                                                // Render years
                                                if (years.length > 1) {
                                                    return years.map(year => (
                                                        <CollapsiblePanel key={year} title={year} defaultOpen={false} className="w-full !max-w-none">
                                                            {renderMonths(groups[year])}
                                                        </CollapsiblePanel>
                                                    ));
                                                } else if (years.length === 1) {
                                                    return renderMonths(groups[years[0]]);
                                                } else {
                                                    return null;
                                                }
                                            })()
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {imageUris.map((obj, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-gray-100 p-2 rounded-lg shadow flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                                        onClick={() => handleImageClick(obj.uri)}
                                                    >
                                                        <img
                                                            src={obj.uri + "/preview"}
                                                            alt="Preview"
                                                            className="max-h-32 max-w-full object-contain rounded shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                                                            onClick={e => { e.stopPropagation(); handleImageClick(obj.uri); }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    ) : (
                                        (selectedTags.length > 0 && triggerFetch > 0) ? (
                                            <span></span>
                                        ) : null
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
                    <div className="relative bg-white p-4 rounded-lg shadow-2xl max-w-5xl max-h-full overflow-hidden flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={handleCloseOverlay}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg font-bold hover:bg-red-700 transition"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        {/* Show the ID as the title above the image */}
                        {(() => {
                            const currentObj = imageUris.find(obj => obj.uri === overlayImageUrl);
                            return currentObj && currentObj.id ? (
                                <div className="text-xl font-bold text-gray-800 mb-1 text-center break-all">{currentObj.id}</div>
                            ) : null;
                        })()}
                        <div className="flex items-center justify-center w-full mt-2 mb-2">
                            <img
                                src={overlayImageUrl}
                                alt="Full size"
                                className="max-h-[80vh] w-auto h-auto max-w-full rounded shadow-lg block mx-auto"
                                style={{ objectFit: 'contain', display: 'block', margin: '0 auto' }}
                            />
                        </div>
                        {/* Controls below the image, never overlapping */}
                        <div className="w-full flex flex-row items-center justify-between mt-2">
                            {/* KNN filter controls - bottom left */}
                            <div style={{ width: 160 }} className="flex flex-col items-stretch gap-2">
                                <button
                                    className={`px-3 py-1 rounded bg-green-600 text-white text-xs font-semibold shadow hover:bg-green-700 transition w-full`}
                                    style={{ minWidth: 0 }}
                                    onClick={() => {
                                        setKnnActive(true);
                                        setKnnUri(overlayImageUrl);
                                        handleCloseOverlay();
                                    }}
                                    title="Add KNN block to query"
                                >
                                    Add kNN Filter
                                </button>
                                <div className="flex flex-row items-center gap-2 mt-1 w-full">
                                    <input
                                        type="number"
                                        min={1}
                                        value={knnValue}
                                        onChange={e => setKnnValue(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-16 px-2 py-1 border rounded text-sm"
                                        title="k"
                                    />
                                    <label className="flex items-center text-xs ml-2">
                                        <input
                                            type="checkbox"
                                            checked={knnReplaceMode}
                                            onChange={e => setKnnReplaceMode(e.target.checked)}
                                            className="mr-1"
                                        />
                                        Replace
                                    </label>
                                </div>
                            </div>
                            {/* Navigation buttons - centered */}
                            <div className="flex items-center justify-center flex-1">
                                <button
                                    onClick={showPrevImage}
                                    disabled={currentIndex <= 0}
                                    className={`mr-2 px-3 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                    aria-label="Previous image"
                                    style={{ minWidth: 40 }}
                                >
                                    &#8592;
                                </button>
                                <button
                                    onClick={showNextImage}
                                    disabled={currentIndex >= imageUris.length - 1}
                                    className={`px-3 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                    aria-label="Next image"
                                    style={{ minWidth: 40 }}
                                >
                                    &#8594;
                                </button>
                            </div>
                            <div className="w-32" /> {/* Spacer to balance layout */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
