import React, { useEffect } from 'react';

const CountrySelector = ({
    selectedCountry, setSelectedCountry, loadingCountries, setLoadingCountries, allCountries, setAllCountries, forceFetchCountries, setForceFetchCountries, countrySearch, setCountrySearch, fetchAllCountries
}) => {
    useEffect(() => {
        fetchAllCountries(forceFetchCountries);
        if (forceFetchCountries) setForceFetchCountries(false);
        // eslint-disable-next-line
    }, [forceFetchCountries]);

    const handleCountrySearchChange = (event) => {
        setCountrySearch(event.target.value);
    };

    const handleCountrySelect = (countryValue) => {
        setSelectedCountry(countryValue);
        setCountrySearch('');
    };

    const handleRemoveCountry = () => {
        setSelectedCountry('');
    };

    const handleClearCountry = () => {
        setSelectedCountry('');
    };

    const filteredCountries = allCountries.filter(
        c =>
            c.toLowerCase().includes(countrySearch.toLowerCase()) &&
            c !== selectedCountry
    );

    return (
        <>
            {/* Force fetch countries button */}
            <div className="mb-4 w-full flex flex-row gap-2 items-center">
                <button
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition text-xs"
                    onClick={() => setForceFetchCountries(true)}
                    disabled={loadingCountries}
                    type="button"
                >
                    Refresh Countries
                </button>
                {loadingCountries && (
                    <span className="text-xs text-gray-400 ml-2">Loading...</span>
                )}
            </div>
            {/* Combined country search and selection dropdown */}
            <div className="mb-6 w-full relative">
                <input
                    type="text"
                    className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-full"
                    placeholder={loadingCountries ? "Loading countries..." : "Type to search or select country"}
                    value={countrySearch}
                    onChange={handleCountrySearchChange}
                    disabled={loadingCountries}
                    autoComplete="off"
                />
                {/* Custom country list */}
                <div
                    className="max-h-48 overflow-y-auto border border-t-0 border-gray-300 rounded-b-md bg-white w-full"
                    style={{ marginTop: '-2px' }}
                >
                    {loadingCountries ? (
                        <div className="p-3 text-gray-400">Loading countries...</div>
                    ) : filteredCountries.length === 0 ? (
                        <div className="p-3 text-gray-400">No countries found</div>
                    ) : (
                        filteredCountries.map((c, index) => (
                            <div
                                key={index}
                                className="p-3 cursor-pointer hover:bg-blue-100 flex items-center"
                                onClick={() => handleCountrySelect(c)}
                            >
                                {selectedCountry === c ? (
                                    <span className="mr-2 text-green-600">✔</span>
                                ) : null}
                                {c}
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Display selected country */}
            {selectedCountry && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                    <div className="flex flex-wrap gap-2 flex-1">
                        <span
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                        >
                            {selectedCountry}
                            <button
                                className="ml-2 text-blue-500 hover:text-red-600 font-bold"
                                onClick={handleRemoveCountry}
                                title="Remove country"
                                type="button"
                            >
                                &times;
                            </button>
                        </span>
                    </div>
                    <button
                        className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs"
                        onClick={handleClearCountry}
                        type="button"
                        title="Clear country"
                    >
                        Clear Country
                    </button>
                </div>
            )}
        </>
    );
};

export default CountrySelector;
