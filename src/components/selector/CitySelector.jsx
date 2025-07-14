import React from 'react';

const CitySelector = ({
    selectedCities, setSelectedCities, loadingCities, allCities, citySearch, setCitySearch, fetchAllCities
}) => {
    const handleCitySearchChange = (event) => {
        setCitySearch(event.target.value);
    };

    const handleCitySelect = (cityValue) => {
        const selectedLower = cityValue.toLowerCase();
        if (selectedCities.map((c) => c.toLowerCase()).includes(selectedLower)) {
            setSelectedCities(selectedCities.filter((c) => c.toLowerCase() !== selectedLower));
        } else {
            setSelectedCities([...selectedCities, cityValue]);
        }
        setCitySearch('');
    };

    const handleRemoveCity = (cityToRemove) => {
        setSelectedCities(selectedCities.filter((c) => c !== cityToRemove));
    };

    const handleClearCities = () => {
        setSelectedCities([]);
    };

    const handleRefreshCities = () => {
        setSelectedCities([]);
        fetchAllCities(true);
    };

    const filteredCities = allCities && Array.isArray(allCities) ? allCities.filter(
        c =>
            c.toLowerCase().includes(citySearch.toLowerCase()) &&
            !selectedCities.map((sc) => sc.toLowerCase()).includes(c.toLowerCase())
    ) : [];

    return (
        <>
            {/* Force fetch cities button */}
            <div className="mb-4 w-full flex flex-row gap-2 items-center justify-between">
                <button
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition text-xs"
                    onClick={handleRefreshCities}
                    disabled={loadingCities}
                    type="button"
                >
                    Refresh Cities
                </button>
                <button
                    className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs"
                    onClick={handleClearCities}
                    type="button"
                    title="Clear cities"
                >
                    Clear Cities
                </button>
            </div>
            {loadingCities ? (
                <div className="mb-4 w-full text-xs text-gray-400 text-left">Loading ...</div>
            ) : (
                <>
                    {/* Combined city search and selection dropdown */}
                    <div className="mb-6 w-full relative">
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-full"
                            placeholder="Type to search or select city"
                            value={citySearch}
                            onChange={handleCitySearchChange}
                            autoComplete="off"
                        />
                        <div
                            className="max-h-48 overflow-y-auto border border-t-0 border-gray-300 rounded-b-md bg-white w-full"
                            style={{ marginTop: '-2px' }}
                        >
                            {filteredCities.length === 0 ? (
                                <div className="p-3 text-gray-400">No cities found</div>
                            ) : (
                                filteredCities.map((c, index) => (
                                    <div
                                        key={index}
                                        className="p-3 cursor-pointer hover:bg-blue-100 flex items-center"
                                        onClick={() => handleCitySelect(c)}
                                    >
                                        {selectedCities.map((sc) => sc.toLowerCase()).includes(c.toLowerCase()) ? (
                                            <span className="mr-2 text-green-600">✔</span>
                                        ) : null}
                                        {c}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {/* Display selected cities */}
                    <div className="mb-4 w-full flex flex-col">
                        <div className="flex flex-row justify-between items-start w-full">
                            <div className="flex flex-wrap gap-2 flex-1">
                                {selectedCities.map((c, idx) => (
                                    <span
                                        key={c + idx}
                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                                    >
                                        {c}
                                        <button
                                            className="ml-2 text-blue-500 hover:text-red-600 font-bold"
                                            onClick={() => handleRemoveCity(c)}
                                            title="Remove city"
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

// Returns SPARQL city filter block and prefixes
export const getCityBlock = (selectedCities, pushUnique) => {
    let cityClauses = [];
    let cityPrefixes = [];
    if (selectedCities.length) {
        pushUnique(cityPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
        const unionFilters = selectedCities
            .map(city => `    { ?img lsc:city "${city.replace(/"/g, '\"')}" . }`)
            .join('\n    UNION\n');
        cityClauses.push(`  {\n${unionFilters}\n  }`);
    }
    return { cityClauses, cityPrefixes };
};

export default CitySelector;
