import React from 'react';
import ResultDisplay from './ResultDisplay';

const ContextOverlay = ({
    show,
    onClose,
    images,
    loading,
    error,
    handleImageClick,
    configuredImagesPerRow,
    contextUri
}) => {
    if (!show) {
        return null;
    }

    const contextImageIndex = images.findIndex(image => image.uri === contextUri);
    const beforeImages = images.slice(0, contextImageIndex);
    const afterImages = images.slice(contextImageIndex + 1);
    const contextImage = images[contextImageIndex];

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="relative bg-white p-4 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg font-bold hover:bg-red-700 transition"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Context Results</h2>
                <div className="w-full flex flex-col justify-around">
                    <div className="w-full pb-2">
                        <h3 className="text-xl font-bold text-center mb-2">Before</h3>
                        <ResultDisplay
                            imageUris={beforeImages}
                            loading={loading}
                            error={error}
                            groupByDay={false}
                            handleImageClick={(e, img) => handleImageClick(e, img, true)}
                            configuredImagesPerRow={configuredImagesPerRow}
                            contextUri={contextUri}
                            isContextOverlay={true}
                        />
                    </div>
                    {contextImage && (
                        <div className="w-full py-2">
                            <h3 className="text-xl font-bold text-center mb-2">Context Image</h3>
                            <div className="flex justify-center">
                                <div
                                    className="bg-yellow-100 p-4 rounded-lg shadow-lg flex justify-center items-center overflow-hidden border-4 border-blue-400 cursor-pointer hover:shadow-xl transition-shadow duration-200"
                                    onClick={(e) => handleImageClick(e, contextImage, true)}
                                >
                                    <img
                                        src={contextImage.uri + "/preview"}
                                        alt="Context Preview"
                                        className="max-h-64 max-w-full object-contain rounded shadow"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="w-full pt-2">
                        <h3 className="text-xl font-bold text-center mb-2">After</h3>
                        <ResultDisplay
                            imageUris={afterImages}
                            loading={loading}
                            error={error}
                            groupByDay={false}
                            handleImageClick={(e, img) => handleImageClick(e, img, true)}
                            configuredImagesPerRow={configuredImagesPerRow}
                            contextUri={contextUri}
                            isContextOverlay={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContextOverlay;
