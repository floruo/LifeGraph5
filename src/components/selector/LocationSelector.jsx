import React from 'react';

const LocationSelector = ({
    selectedLocations, setSelectedLocations, loadingLocations, allLocations, locationSearch, setLocationSearch, fetchAllLocations,
}) => {
    const handleLocationSearchChange = (event) => {
        setLocationSearch(event.target.value);
    };

    const handleLocationSelect = (locationValue) => {
        const selectedLower = locationValue.toLowerCase();
        if (selectedLocations.map((l) => l.toLowerCase()).includes(selectedLower)) {
            setSelectedLocations(selectedLocations.filter((l) => l.toLowerCase() !== selectedLower));
        } else {
            setSelectedLocations([...selectedLocations, locationValue]);
        }
        setLocationSearch('');
    };

    const handleRemoveLocation = (locationToRemove) => {
        setSelectedLocations(selectedLocations.filter((l) => l !== locationToRemove));
    };

    const handleClearLocations = () => {
        setSelectedLocations([]);
    };

    const handleRefreshLocations = () => {
        setSelectedLocations([]);
        fetchAllLocations(true);
    };

    const filteredLocations = allLocations && Array.isArray(allLocations) ? allLocations.filter(
        l =>
            l.toLowerCase().includes(locationSearch.toLowerCase()) &&
            !selectedLocations.map((sl) => sl.toLowerCase()).includes(l.toLowerCase())
    ) : [];

    return (
        <>
            {/* Force fetch locations button */}
            <div className="mb-4 w-full flex flex-row gap-2 items-center justify-between">
                <button
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition text-xs"
                    onClick={handleRefreshLocations}
                    disabled={loadingLocations}
                    type="button"
                >
                    Refresh Locations
                </button>
                <button
                    className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs"
                    onClick={handleClearLocations}
                    type="button"
                    title="Clear locations"
                >
                    Clear Locations
                </button>
            </div>
            {loadingLocations ? (
                <div className="mb-4 w-full text-xs text-gray-400 text-left">Loading ...</div>
            ) : (
                <>
                    {/* Combined location search and selection dropdown */}
                    <div className="mb-6 w-full relative">
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-full"
                            placeholder="Type to search or select location"
                            value={locationSearch}
                            onChange={handleLocationSearchChange}
                            autoComplete="off"
                        />
                        <div
                            className="max-h-48 overflow-y-auto border border-t-0 border-gray-300 rounded-b-md bg-white w-full"
                            style={{ marginTop: '-2px' }}
                        >
                            {filteredLocations.length === 0 ? (
                                <div className="p-3 text-gray-400">No locations found</div>
                            ) : (
                                filteredLocations.map((l, index) => (
                                    <div
                                        key={index}
                                        className="p-3 cursor-pointer hover:bg-blue-100 flex items-center"
                                        onClick={() => handleLocationSelect(l)}
                                    >
                                        {selectedLocations.map((sl) => sl.toLowerCase()).includes(l.toLowerCase()) ? (
                                            <span className="mr-2 text-green-600">✔</span>
                                        ) : null}
                                        {l}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {/* Display selected locations */}
                    <div className="mb-4 w-full flex flex-col">
                        <div className="flex flex-row justify-between items-start w-full">
                            <div className="flex flex-wrap gap-2 flex-1">
                                {selectedLocations.map((l, idx) => (
                                    <span
                                        key={l + idx}
                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                                    >
                                        {l}
                                        <button
                                            className="ml-2 text-blue-500 hover:text-red-600 font-bold"
                                            onClick={() => handleRemoveLocation(l)}
                                            title="Remove location"
                                            type="button"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

// Returns SPARQL location filter block and prefixes
export const getLocationBlock = (selectedLocations, pushUnique) => {
    let locationClauses = [];
    let locationPrefixes = [];
    if (selectedLocations.length) {
        pushUnique(locationPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
        const unionFilters = selectedLocations
            .map(loc => `    { ?img lsc:location_name "${loc.replace(/"/g, '\"')}" . }`)
            .join('\n    UNION\n');
        locationClauses.push(`  {\n${unionFilters}\n  }`);
    }
    return { locationClauses, locationPrefixes };
};

export default LocationSelector;
