import React from "react";

const CategorySelector = ({
  selectedCategories,
  setSelectedCategories,
  loading,
  categories,
  fetchAllCategories,
}) => {
  const [categorySearch, setCategorySearch] = React.useState("");

  const handleCategorySearchChange = (event) => {
    setCategorySearch(event.target.value.toLowerCase());
  };

  const handleCategorySelect = (catValue) => {
    const selectedLower = catValue.toLowerCase();
    if (selectedCategories.map((sc) => sc.toLowerCase()).includes(selectedLower)) {
      setSelectedCategories(selectedCategories.filter((sc) => sc.toLowerCase() !== selectedLower));
    } else {
      setSelectedCategories([...selectedCategories, catValue]);
    }
    setCategorySearch("");
  };

  const handleRemoveCategory = (catToRemove) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== catToRemove));
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  const filteredCategories = categories && Array.isArray(categories) ? categories.filter(
    (c) =>
      c.toLowerCase().includes(categorySearch) &&
      !selectedCategories.map((sc) => sc.toLowerCase()).includes(c.toLowerCase())
  ) : [];

  const handleRefreshCategories = () => {
    setSelectedCategories([]); // Clear selected categories on refresh
    fetchAllCategories(true);
  };

  return (
    <>
      {/* Force fetch categories button */}
      <div className="mb-4 w-full flex flex-row gap-2 items-center justify-between">
        <button
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition text-xs"
          onClick={handleRefreshCategories}
          disabled={loading}
          type="button"
        >
          Refresh Categories
        </button>
        <button
          className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs"
          onClick={handleClearCategories}
          type="button"
          title="Clear categories"
        >
          Clear Categories
        </button>
      </div>
      {loading ? (
        <div className="mb-4 w-full text-xs text-gray-400 text-left">Loading ...</div>
      ) : (
        <>
          {/* Combined category search and selection dropdown */}
          <div className="mb-6 w-full relative">
            <input
              type="text"
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-full"
              placeholder="Type to search or select categories"
              value={categorySearch}
              onChange={handleCategorySearchChange}
              disabled={loading}
              autoComplete="off"
            />
            <div
              className="max-h-48 overflow-y-auto border border-t-0 border-gray-300 rounded-b-md bg-white w-full"
              style={{ marginTop: "-2px" }}
            >
              {filteredCategories.length === 0 ? (
                <div className="p-3 text-gray-400">No categories found</div>
              ) : (
                filteredCategories.map((c, index) => (
                  <div
                    key={c + index}
                    className="p-3 cursor-pointer hover:bg-blue-100 flex items-center"
                    onClick={() => handleCategorySelect(c)}
                  >
                    {selectedCategories.map((sc) => sc.toLowerCase()).includes(c.toLowerCase()) ? (
                      <span className="mr-2 text-green-600">✔</span>
                    ) : null}
                    {c.toLowerCase()}
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Display selected categories as a set with clear button always at top right */}
          <div className="mb-4 w-full flex flex-col">
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-wrap gap-2 flex-1">
                {selectedCategories.map((c, idx) => (
                  <span
                    key={c + idx}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                  >
                    {c.toLowerCase()}
                    <button
                      className="ml-2 text-blue-500 hover:text-red-600 font-bold"
                      onClick={() => handleRemoveCategory(c)}
                      title="Remove category"
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

export default CategorySelector;
