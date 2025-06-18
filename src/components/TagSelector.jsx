import React, { useEffect } from 'react';

const TagSelector = ({
    selectedTags, setSelectedTags, queryMode, setQueryMode, loadingTags, setLoadingTags, allTags, setAllTags, forceFetchTags, setForceFetchTags, tagSearch, setTagSearch, fetchAllTags
}) => {
    useEffect(() => {
        fetchAllTags(forceFetchTags);
        if (forceFetchTags) setForceFetchTags(false);
        // eslint-disable-next-line
    }, [forceFetchTags]);

    const handleTagSearchChange = (event) => {
        setTagSearch(event.target.value.toLowerCase());
    };

    const handleTagSelect = (tagValue) => {
        const selectedLower = tagValue.toLowerCase();
        if (selectedTags.map(st => st.toLowerCase()).includes(selectedLower)) {
            setSelectedTags(selectedTags.filter(st => st.toLowerCase() !== selectedLower));
        } else {
            setSelectedTags([...selectedTags, tagValue]);
        }
        setTagSearch('');
    };

    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
    };

    const filteredTags = allTags.filter(
        t =>
            t.toLowerCase().includes(tagSearch) &&
            !selectedTags.map(st => st.toLowerCase()).includes(t.toLowerCase())
    );

    return (
        <>
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
                {selectedTags.map((t) => (
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
        </>
    );
};

export default TagSelector;

