import React from "react";
import { CollapsiblePanel } from "./RenderFilters";

const ResultDisplay = ({
  imageUris,
  loading,
  error,
  groupByDay,
  handleImageClick,
  submitImage,
  triggerFetch,
  selectedTags,
  overlayImageUrl,
  configuredImagesPerRow,
  contextActive = false,
  contextUri = null
}) => {
  const [imagesPerRow, setImagesPerRow] = React.useState(configuredImagesPerRow);
  const [fullscreen, setFullscreen] = React.useState(false);

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
      groups[year][month][dateStr].push(obj);
    });
    return groups;
  }

  React.useEffect(() => {
    if (!fullscreen) return;
    const handleKeyDown = (e) => {
      // Only exit fullscreen if overlay is not open
      if (e.key === 'Escape' && !overlayImageUrl) setFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen, overlayImageUrl]);

  if (loading) {
    return (
      <div className="text-center text-blue-600">
        <p>Loading image URIs for selected tags...</p>
        <div className="mt-4 animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }
  if (error && imageUris.length > 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  if (!loading && !error && imageUris.length === 0 && triggerFetch > 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12">
        <p className="text-center text-gray-600 text-lg">No results found.</p>
      </div>
    );
  }
  if (contextActive && contextUri && imageUris.length > 0) {
    // Find the index of the context image
    const idx = imageUris.findIndex(obj => obj.uri === contextUri);
    if (idx !== -1) {
      const before = imageUris.slice(0, idx);
      const contextImg = imageUris[idx];
      const after = imageUris.slice(idx + 1);
      return (
        <div className={`w-full flex-1${fullscreen ? ' fixed inset-0 z-50 bg-white p-8 overflow-auto' : ''}`}>
          {imageUris.length > 0 && (
            <div className="w-full flex justify-between items-center mb-2 gap-2">
              <div className="flex items-center">
                <label htmlFor="imagesPerRow" className="mr-2 text-sm text-gray-700">Images per row:</label>
                <select
                  id="imagesPerRow"
                  value={imagesPerRow}
                  onChange={e => setImagesPerRow(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[4, 6, 8, 10, 12].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <button
                className={`px-3 py-1 rounded shadow text-xs transition ${fullscreen ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                onClick={() => setFullscreen(f => !f)}
                type="button"
              >
                {fullscreen ? 'Exit Fullscreen' : 'Fullscreen Results'}
              </button>
            </div>
          )}
          <div className="w-full flex flex-col gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Before</h2>
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${imagesPerRow} gap-4`}>
                {before.map((obj, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-2 rounded-lg shadow flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={(e) => handleImageClick(e, obj)}
                  >
                    <img
                      src={obj.uri + "/preview"}
                      alt="Preview"
                      className="max-h-32 max-w-full object-contain rounded shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={e => { e.stopPropagation(); handleImageClick(e, obj); }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-700 mb-2">Context Image</h2>
              <div className="flex justify-center">
                <div
                  className="bg-yellow-100 p-4 rounded-lg shadow-lg flex justify-center items-center overflow-hidden border-4 border-blue-400"
                  onClick={(e) => handleImageClick(e, contextImg)}
                >
                  <img
                    src={contextImg.uri + "/preview"}
                    alt="Context Preview"
                    className="max-h-64 max-w-full object-contain rounded shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={e => { e.stopPropagation(); handleImageClick(e, contextImg); }}
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">After</h2>
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${imagesPerRow} gap-4`}>
                {after.map((obj, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-2 rounded-lg shadow flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={(e) => handleImageClick(e, obj)}
                  >
                    <img
                      src={obj.uri + "/preview"}
                      alt="Preview"
                      className="max-h-32 max-w-full object-contain rounded shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={e => { e.stopPropagation(); handleImageClick(e, obj); }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  return (
    <div className={`w-full flex-1${fullscreen ? ' fixed inset-0 z-50 bg-white p-8 overflow-auto' : ''}`}>
      {imageUris.length > 0 && (
        <div className="w-full flex justify-between items-center mb-2 gap-2">
          <div className="flex items-center">
            <label htmlFor="imagesPerRow" className="mr-2 text-sm text-gray-700">Images per row:</label>
            <select
              id="imagesPerRow"
              value={imagesPerRow}
              onChange={e => setImagesPerRow(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {[4, 6, 8, 10, 12].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <button
            className={`px-3 py-1 rounded shadow text-xs transition ${fullscreen ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            onClick={() => setFullscreen(f => !f)}
            type="button"
          >
            {fullscreen ? 'Exit Fullscreen' : 'Fullscreen Results'}
          </button>
        </div>
      )}
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
                    <div className={`w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${imagesPerRow} gap-4`}>
                      {daysObj[day].map((obj, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 p-2 rounded-lg shadow flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                          onClick={(e) => handleImageClick(e, obj)}
                        >
                          <img
                            src={obj.uri + "/preview"}
                            alt="Preview"
                            className="max-h-32 max-w-full object-contain rounded shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={e => { e.stopPropagation(); handleImageClick(e, obj); }}
                          />
                        </div>
                      ))}
                    </div>
                  </CollapsiblePanel>
                ));
              } else if (days.length === 1) {
                return (
                  <div className={`w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${imagesPerRow} gap-4`}>
                    {daysObj[days[0]].map((obj, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 p-2 rounded-lg shadow flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                        onClick={(e) => handleImageClick(e, obj)}
                      >
                        <img
                          src={obj.uri + "/preview"}
                          alt="Preview"
                          className="max-h-32 max-w-full object-contain rounded shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={e => { e.stopPropagation(); handleImageClick(e, obj); }}
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
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${imagesPerRow} gap-4`}>
            {imageUris.map((obj, index) => (
              <div
                key={index}
                className="bg-gray-100 p-2 rounded-lg shadow flex justify-center items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={(e) => handleImageClick(e, obj)}
              >
                <img
                  src={obj.uri + "/preview"}
                  alt="Preview"
                  className="max-h-32 max-w-full object-contain rounded shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={e => { e.stopPropagation(); handleImageClick(e, obj); }}
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
  );
};

export default ResultDisplay;
