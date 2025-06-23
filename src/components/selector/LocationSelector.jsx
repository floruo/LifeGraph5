import React from 'react';

const LocationSelector = ({
    selectedLocation, setSelectedLocation, loadingLocations, setLoadingLocations, allLocations, setAllLocations, locationSearch, setLocationSearch, fetchAllLocations
}) => {
    const handleLocationSearchChange = (event) => {
        setLocationSearch(event.target.value);
    };

    const handleLocationSelect = (locationValue) => {
        setSelectedLocation(locationValue);
        setLocationSearch('');
    };

    const handleClearLocation = () => {
        setSelectedLocation('');
    };

    const handleRefreshLocations = () => {
        fetchAllLocations(true); // Force refresh, bypass cache
    };

    const filteredLocations = allLocations.filter(
        l =>
            l.toLowerCase().includes(locationSearch.toLowerCase()) &&
            l !== selectedLocation
    );

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
                    onClick={handleClearLocation}
                    type="button"
                    title="Clear location"
                >
                    Clear Location
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
                                        {selectedLocation === l ? (
                                            <span className="mr-2 text-green-600">✔</span>
                                        ) : null}
                                        {l}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {/* Display selected location */}
                    {selectedLocation && (
                        <div className="mb-4 flex flex-wrap gap-2 items-center">
                            <div className="flex flex-wrap gap-2 flex-1">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded shadow text-xs">{selectedLocation}</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

// Returns SPARQL location filter block and prefixes
export const getLocationBlock = (selectedLocation, pushUnique) => {
    let locationClauses = [];
    let locationPrefixes = [];
    if (selectedLocation) {
        pushUnique(locationPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
        locationClauses.push(`  {\n    ?img lsc:location_name \"${selectedLocation.replace(/\"/g, '\\"')}\" .\n  }`);
    }
    return { locationClauses, locationPrefixes };
};

export default LocationSelector;
