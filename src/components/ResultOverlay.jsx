import React from 'react';
import { DresSubmission } from './DresClient';

const ResultOverlay = ({
    overlayImageUrl,
    imageUris,
    handleCloseOverlay,
    setKnnActive,
    setKnnUri,
    knnValue,
    setKnnValue,
    knnReplaceMode,
    setKnnReplaceMode,
    setNearDuplicateActive,
    setNearDuplicateUri,
    showPrevImage,
    showNextImage,
    currentIndex,
    onOpenContextOverlay,
    contextValue,
    setContextValue,
    submissionApi,
    dresSession,
    activeRun,
}) => {
    if (!overlayImageUrl) return null;
    const currentObj = imageUris.find(obj => obj.uri === overlayImageUrl);
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
            onClick={handleCloseOverlay}
        >
            <div className="relative bg-white p-4 rounded-lg shadow-2xl max-w-5xl max-h-full overflow-hidden flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <button
                    onClick={handleCloseOverlay}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg font-bold hover:bg-red-700 transition"
                    aria-label="Close"
                >
                    &times;
                </button>
                {/* Show the ID as the title above the image */}
                {currentObj && currentObj.id ? (
                    <div className="text-xl font-bold text-gray-800 mb-1 text-center break-all">{currentObj.id}</div>
                ) : null}
                <div className="flex items-center justify-center w-full mt-2 mb-2">
                    <img
                        src={overlayImageUrl}
                        alt="Full size"
                        className="max-h-[80vh] w-auto h-auto max-w-full rounded shadow-lg block mx-auto"
                        style={{ objectFit: 'contain', display: 'block', margin: '0 auto' }}
                    />
                </div>
                {/* Controls and navigation in a single row, three columns */}
                <div className="w-full flex flex-row items-center justify-between mt-2">
                    {/* Left: KNN and Near Duplicate */}
                    <div className="flex flex-row items-center gap-2" style={{ width: 320 }}>
                        <div className="flex flex-col items-stretch gap-2" style={{ minWidth: 0 }}>
                            <button
                                className={`px-3 py-1 rounded bg-green-600 text-white text-xs font-semibold shadow hover:bg-green-700 transition w-full`}
                                style={{ minWidth: 0 }}
                                onClick={() => {
                                    setKnnActive(true);
                                    handleCloseOverlay();
                                }}
                                title="Add KNN block to query"
                            >
                                Add kNN Filter
                            </button>
                            <div className="flex flex-row items-center gap-2 mt-1 w-full">
                                <input
                                    type="number"
                                    min={1}
                                    value={knnValue}
                                    onChange={e => setKnnValue(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-16 px-2 py-1 border rounded text-sm"
                                    title="k"
                                />
                                <label className="flex items-center text-xs ml-2">
                                    <input
                                        type="checkbox"
                                        checked={knnReplaceMode}
                                        onChange={e => setKnnReplaceMode(e.target.checked)}
                                        className="mr-1"
                                    />
                                    Replace
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-col items-stretch gap-2" style={{ minWidth: 0 }}>
                            <button
                                className="ml-4 px-3 py-1 rounded bg-purple-600 text-white text-xs font-semibold shadow hover:bg-purple-700 transition"
                                style={{ minWidth: 0,  }}
                                onClick={() => {
                                    setNearDuplicateActive(true);
                                    setNearDuplicateUri(overlayImageUrl);
                                    handleCloseOverlay();
                                }}
                                title="Show near duplicates for this image"
                            >
                                Near Duplicates
                            </button>
                            <div className="flex flex-row items-center gap-2 mt-1 w-full">
                                <button
                                    className="ml-4 px-3 py-1 rounded bg-orange-600 text-white text-xs font-semibold shadow hover:bg-orange-700 transition"
                                    style={{ minWidth: 0,  }}
                                    onClick={() => {
                                        onOpenContextOverlay(overlayImageUrl, contextValue);
                                        handleCloseOverlay();
                                    }}
                                    title="Show context for this image"
                                >
                                    Context
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    max={500}

                                    value={contextValue}
                                    onChange={e => setContextValue(Math.max(1, Math.min(500, parseInt(e.target.value)) || 1))}
                                    className="w-16 px-2 py-1 border rounded text-sm"
                                    title="n"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Middle: Navigation */}
                    <div className="flex items-center justify-center">
                        <button
                            onClick={showPrevImage}
                            disabled={currentIndex <= 0}
                            className={`mr-2 px-3 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label="Previous image"
                            style={{ minWidth: 40 }}
                        >
                            &#8592;
                        </button>
                        <button
                            onClick={showNextImage}
                            disabled={currentIndex >= imageUris.length - 1}
                            className={`px-3 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label="Next image"
                            style={{ minWidth: 40 }}
                        >
                            &#8594;
                        </button>
                    </div>

                    {/* Right: DRES Submission */}
                    <div className="flex flex-row items-center justify-end gap-2" style={{ width: 320 }}>
                        <DresSubmission
                            submissionApi={submissionApi}
                            dresSession={dresSession}
                            activeRun={activeRun}
                            imageId={currentObj.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultOverlay;
