import React from 'react';

const CountrySelector = ({
    selectedCountries, setSelectedCountries, loadingCountries, allCountries, countrySearch, setCountrySearch, fetchAllCountries
}) => {
    const handleCountrySearchChange = (event) => {
        setCountrySearch(event.target.value);
    };

    const handleCountrySelect = (countryValue) => {
        const selectedLower = countryValue.toLowerCase();
        if (selectedCountries.map((c) => c.toLowerCase()).includes(selectedLower)) {
            setSelectedCountries(selectedCountries.filter((c) => c.toLowerCase() !== selectedLower));
        } else {
            setSelectedCountries([...selectedCountries, countryValue]);
        }
        setCountrySearch('');
    };

    const handleRemoveCountry = (countryToRemove) => {
        setSelectedCountries(selectedCountries.filter((c) => c !== countryToRemove));
    };

    const handleClearCountries = () => {
        setSelectedCountries([]);
    };

    const handleRefreshCountries = () => {
        setSelectedCountries([]);
        fetchAllCountries(true);
    };

    const filteredCountries = allCountries && Array.isArray(allCountries) ? allCountries.filter(
        c =>
            c.toLowerCase().includes(countrySearch.toLowerCase()) &&
            !selectedCountries.map((sc) => sc.toLowerCase()).includes(c.toLowerCase())
    ) : [];

    return (
        <>
            {/* Force fetch countries button */}
            <div className="mb-4 w-full flex flex-row gap-2 items-center justify-between">
                <button
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition text-xs"
                    onClick={handleRefreshCountries}
                    disabled={loadingCountries}
                    type="button"
                >
                    Refresh Countries
                </button>
                <button
                    className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs"
                    onClick={handleClearCountries}
                    type="button"
                    title="Clear countries"
                >
                    Clear Countries
                </button>
            </div>
            {loadingCountries ? (
                <div className="mb-4 w-full text-xs text-gray-400 text-left">Loading ...</div>
            ) : null}
            {!loadingCountries ? (
                <>
                    {/* Combined country search and selection dropdown */}
                    <div className="mb-6 w-full relative">
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-full"
                            placeholder="Type to search or select country"
                            value={countrySearch}
                            onChange={handleCountrySearchChange}
                            autoComplete="off"
                        />
                        <div
                            className="max-h-48 overflow-y-auto border border-t-0 border-gray-300 rounded-b-md bg-white w-full"
                            style={{ marginTop: '-2px' }}
                        >
                            {filteredCountries.length === 0 ? (
                                <div className="p-3 text-gray-400">No countries found</div>
                            ) : (
                                filteredCountries.map((c, index) => (
                                    <div
                                        key={index}
                                        className="p-3 cursor-pointer hover:bg-blue-100 flex items-center"
                                        onClick={() => handleCountrySelect(c)}
                                    >
                                        {selectedCountries.map((sc) => sc.toLowerCase()).includes(c.toLowerCase()) ? (
                                            <span className="mr-2 text-green-600">✔</span>
                                        ) : null}
                                        {c}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {/* Display selected countries */}
                    <div className="mb-4 w-full flex flex-col">
                        <div className="flex flex-row justify-between items-start w-full">
                            <div className="flex flex-wrap gap-2 flex-1">
                                {selectedCountries.map((c, idx) => (
                                    <span
                                        key={c + idx}
                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                                    >
                                        {c}
                                        <button
                                            className="ml-2 text-blue-500 hover:text-red-600 font-bold"
                                            onClick={() => handleRemoveCountry(c)}
                                            title="Remove country"
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
            ) : null}
        </>
    );
};

// Returns SPARQL country filter block and prefixes
export const getCountryBlock = (selectedCountries, pushUnique) => {
    let countryClauses = [];
    let countryPrefixes = [];
    if (selectedCountries.length) {
        pushUnique(countryPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
        const unionFilters = selectedCountries
            .map(country => `    { ?img lsc:country "${country.replace(/"/g, '\"')}" . }`)
            .join('\n    UNION\n');
        countryClauses.push(`  {\n${unionFilters}\n  }`);
    }
    return { countryClauses, countryPrefixes };
};

export default CountrySelector;
