// App.jsx
import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
    // State to store generated preview URLs and their original URIs
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);         // State to manage loading status (initially false)
    const [error, setError] = useState(null);             // State to store any errors
    const [category, setCategory] = useState('cat');      // State to hold the category input value, default to 'cat'
    const [triggerFetch, setTriggerFetch] = useState(0);  // State to trigger fetch manually
    const [allCategories, setAllCategories] = useState([]); // New state to store all available categories for autocomplete
    const [loadingCategories, setLoadingCategories] = useState(true); // New state for category loading

    // State for image overlay
    // Now stores the original full-size URL of the image to display in overlay
    const [overlayImageUrl, setOverlayImageUrl] = useState(null);

    // Your SPARQL endpoint URL for GET requests
    const sparqlEndpointUrl = 'http://localhost:8080/query/sparql';

    // Function to fetch all distinct categories for autocomplete
    const fetchAllCategories = async () => {
        const categoriesQuery = `
      SELECT DISTINCT ?category
      WHERE {
        ?s <https://cocodataset.org/category> ?category .
      }
      ORDER BY ?category # Optional: Order categories alphabetically
    `;

        try {
            setLoadingCategories(true);
            const urlWithQuery = `${sparqlEndpointUrl}?query=${encodeURIComponent(categoriesQuery)}`;
            const response = await fetch(urlWithQuery, {
                method: 'GET',
                headers: {
                    'Accept': 'application/sparql-results+json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error fetching categories! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.results && data.results.bindings) {
                const categories = data.results.bindings
                    .map(binding => binding.category?.value)
                    .filter(Boolean); // Ensure valid values
                setAllCategories(categories);
                console.log('Fetched all categories for autocomplete:', categories);
            } else {
                setAllCategories([]);
                console.warn('No categories found in SPARQL response:', data);
            }
        } catch (err) {
            console.error('Error fetching categories for autocomplete:', err);
            // Optionally set an error specifically for category fetching
        } finally {
            setLoadingCategories(false);
        }
    };

    // Function to fetch data from the SPARQL endpoint based on the input category
    const fetchImageUrisAndPreviews = async () => {
        // Escape quotes in the category string to prevent SPARQL injection issues
        const escapedCategory = category.replace(/"/g, '\\"');

        // UPDATED SPARQL query to retrieve image URIs (in ?s) based on the input category
        const sparqlQuery = `
      PREFIX derived: <http://megras.org/derived/>
      PREFIX megras: <http://megras.org/schema#>
      
      SELECT DISTINCT ?s
      WHERE {
        ?segment <https://cocodataset.org/category> "${escapedCategory}" .
        ?segment megras:segmentOf ?s .
      }
      LIMIT 20 # Limit the number of results for quicker display
    `;

        try {
            setLoading(true); // Set loading to true before fetching
            setError(null);   // Clear previous errors
            setImagePreviews([]); // Clear previous images when a new search starts

            // Construct the URL for a GET request with the query parameter
            const urlWithQuery = `${sparqlEndpointUrl}?query=${encodeURIComponent(sparqlQuery)}`;

            const response = await fetch(urlWithQuery, {
                method: 'GET',
                headers: {
                    'Accept': 'application/sparql-results+json' // Request JSON results
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched SPARQL results:', data);

            if (data.results && data.results.bindings) {
                const fetchedData = data.results.bindings
                    .map(binding => {
                        const originalUri = binding.s?.value; // This is the original image URI
                        if (originalUri) {
                            const previewUrl = `${originalUri}/preview`; // This is the preview URI
                            return { originalUri, previewUrl }; // Store both
                        }
                        return null;
                    })
                    .filter(Boolean); // Remove any null entries

                setImagePreviews(fetchedData); // Update state with objects containing both URIs
                console.log('Generated image data (original and preview URLs):', fetchedData);

            } else {
                setImagePreviews([]);
                console.warn('No image URIs found in SPARQL response for category:', category, data);
            }

        } catch (err) {
            console.error('Error fetching image data:', err);
            setError(`Failed to fetch data for category '${category}': ${err.message}`);
        } finally {
            setLoading(false); // Set loading to false after fetch attempt
        }
    };

    // useEffect to trigger the fetch function whenever 'triggerFetch' state changes
    // or on initial component mount.
    useEffect(() => {
        fetchImageUrisAndPreviews();
    }, [triggerFetch]); // Dependency on triggerFetch to re-run fetch when button is clicked

    // useEffect to fetch all categories once on component mount
    useEffect(() => {
        fetchAllCategories();
    }, []); // Empty dependency array means this runs only once

    // Handler for input field change
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    // Handler for search button click
    const handleSearchClick = () => {
        // Increment triggerFetch to re-run the useEffect and fetch new data
        setTriggerFetch(prev => prev + 1);
    };

    // Handler for showing the overlay, now passing the originalUri
    const handleImageClick = (originalUri) => {
        setOverlayImageUrl(originalUri); // Set the original URI for the overlay
    };

    // Handler for closing the overlay
    const handleCloseOverlay = () => {
        setOverlayImageUrl(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Lifelog Image Previews
                </h1>

                {/* Input field for category with autocomplete */}
                <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <input
                        type="text"
                        list="category-suggestions" // Link to the datalist
                        className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-full sm:w-auto"
                        placeholder={loadingCategories ? "Loading categories..." : "Enter image category (e.g., cat, dog, car)"}
                        value={category}
                        onChange={handleCategoryChange}
                        onKeyPress={(e) => { // Allow pressing Enter to search
                            if (e.key === 'Enter') {
                                handleSearchClick();
                            }
                        }}
                        disabled={loadingCategories} // Disable input while categories are loading
                    />
                    {/* Datalist for autocomplete suggestions */}
                    <datalist id="category-suggestions">
                        {allCategories.map((cat, index) => (
                            <option key={index} value={cat} />
                        ))}
                    </datalist>

                    <button
                        onClick={handleSearchClick}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out w-full sm:w-auto"
                        disabled={loadingCategories || loading} // Disable button if categories or images are loading
                    >
                        {loadingCategories ? "Loading..." : "Search Images"}
                    </button>
                </div>

                {loading && (
                    <div className="text-center text-blue-600">
                        <p>Loading image URIs and generating previews for "{category}"...</p>
                        <div className="mt-4 animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                {!loading && !error && (
                    <div>
                        {imagePreviews.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {imagePreviews.map((image, index) => ( // Iterate over image objects
                                    <div
                                        key={index}
                                        className="bg-gray-50 p-2 rounded-lg shadow-md flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                        onClick={() => handleImageClick(image.originalUri)} // Pass originalUri to click handler
                                    >
                                        <img
                                            src={image.previewUrl} // Still display preview in the grid
                                            alt={`Lifelog Preview ${index}`}
                                            className="max-w-full h-auto object-contain rounded-md"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Failed+to+Load"; }}
                                            loading="lazy" // Improve performance by loading images as they scroll into view
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600 text-lg">No image previews found for category "{category}". Please check your SPARQL endpoint and query.</p>
                        )}
                    </div>
                )}

                <p className="text-sm text-gray-500 mt-8 text-center">
                    Click on an image to view it in full size.
                </p>
            </div>

            {/* Image Overlay */}
            {overlayImageUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseOverlay} // Close when clicking outside the image
                >
                    <div className="relative bg-white p-4 rounded-lg shadow-2xl max-w-5xl max-h-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={handleCloseOverlay}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg font-bold hover:bg-red-700 transition"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <img
                            src={overlayImageUrl} // This now uses the original image URI
                            alt="Full size preview"
                            className="max-w-full max-h-[80vh] object-contain rounded-md" // Max height relative to viewport
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x200?text=Failed+to+Load"; }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
