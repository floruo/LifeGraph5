import React, { useState } from 'react';
import { DresSubmission } from './DresClient';
import { fetchImageInfos } from '../utils/sparql';

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
    isFromContext,
}) => {
    const [showInfoOverlay, setShowInfoOverlay] = useState(false);
    const [infoTriples, setInfoTriples] = useState([]);
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [infoError, setInfoError] = useState(null);

    const fetchInfos = async () => {
        if (!overlayImageUrl) return;
        setLoadingInfo(true);
        setInfoError(null);
        try {
            const triples = await fetchImageInfos(overlayImageUrl);
            setInfoTriples(triples);
        } catch (err) {
            setInfoError(err.message);
        } finally {
            setLoadingInfo(false);
        }
    };

    const handleCloseAllOverlays = () => {
        setShowInfoOverlay(false);
        handleCloseOverlay();
    };

    if (!overlayImageUrl) return null;
    const currentObj = imageUris.find(obj => obj.uri === overlayImageUrl) || {};
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center"
            onClick={handleCloseAllOverlays}
        >
            <div className="relative bg-white p-4 rounded-lg shadow-2xl max-w-5xl max-h-full overflow-hidden flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <button
                    onClick={handleCloseAllOverlays}
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
                                    setKnnUri(overlayImageUrl);
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
                                <input
                                    type="number"
                                    min={1}
                                    max={500}

                                    value={contextValue}
                                    onChange={e => setContextValue(Math.max(1, Math.min(500, parseInt(e.target.value)) || 1))}
                                    className="w-16 px-2 py-1 border rounded text-sm"
                                    title="n"
                                    //disabled={isFromContext}
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
                        <button
                            className="ml-4 px-5 py-1 rounded bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition"
                            style={{ minWidth: 80 }}
                            onClick={() => {
                                setShowInfoOverlay(true);
                                fetchInfos();
                            }}
                            title="Show all info triples for this image"
                        >
                            Show Infos
                        </button>
                         <DresSubmission
                            submissionApi={submissionApi}
                            dresSession={dresSession}
                            activeRun={activeRun}
                            imageId={currentObj.id}
                            disabled={!currentObj.id}
                        />
                    </div>
                </div>
                {/* Info Overlay */}
                {showInfoOverlay && (
                    <div
                        className="absolute inset-0 bg-white bg-opacity-95 z-[80] flex flex-col items-center justify-start p-6 overflow-y-auto"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <button
                            onClick={() => setShowInfoOverlay(false)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg font-bold hover:bg-red-700 transition"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-bold mb-4">Image Infos</h2>
                        {loadingInfo && <div>Loading...</div>}
                        {infoError && <div className="text-red-600">Error: {infoError}</div>}
                        {!loadingInfo && !infoError && (
                            <div className="w-full max-h-[70vh] overflow-y-auto">
                                <table className="table-fixed w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th className="px-2 py-1 text-left w-1/3 whitespace-nowrap">Predicate</th>
                                            <th className="px-2 py-1 text-left w-2/3">Object</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {infoTriples.length === 0 ? (
                                            <tr><td colSpan={2}>No info found.</td></tr>
                                        ) : (
                                            infoTriples.map((triple, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-2 py-1 whitespace-nowrap overflow-hidden text-ellipsis" style={{maxWidth: '1px'}}>{triple.p?.value}</td>
                                                    <td className="px-2 py-1 break-words" style={{wordBreak: 'break-word'}}>{triple.o?.value}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultOverlay;
