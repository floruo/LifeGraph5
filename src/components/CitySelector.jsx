import React from 'react';

const CitySelector = ({
    selectedCity, setSelectedCity, loadingCities, setLoadingCities, allCities, setAllCities, citySearch, setCitySearch, fetchAllCities
}) => {

    const handleCitySearchChange = (event) => {
        setCitySearch(event.target.value);
    };

    const handleCitySelect = (cityValue) => {
        setSelectedCity(cityValue);
        setCitySearch('');
    };

    const handleRemoveCity = () => {
        setSelectedCity('');
    };

    const handleClearCity = () => {
        setSelectedCity('');
    };

    const handleRefreshCities = () => {
        fetchAllCities(true); // Force refresh, bypass cache
    };

    const filteredCities = allCities.filter(
        c =>
            c.toLowerCase().includes(citySearch.toLowerCase()) &&
            c !== selectedCity
    );

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
                    onClick={handleClearCity}
                    type="button"
                    title="Clear city"
                >
                    Clear City
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
                                        {selectedCity === c ? (
                                            <span className="mr-2 text-green-600">✔</span>
                                        ) : null}
                                        {c}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {/* Display selected city */}
                    {selectedCity && (
                        <div className="mb-4 flex flex-wrap gap-2 items-center">
                            <div className="flex flex-wrap gap-2 flex-1">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded shadow text-xs">{selectedCity}</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default CitySelector;
