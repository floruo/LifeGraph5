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
