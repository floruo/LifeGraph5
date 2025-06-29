import React from 'react';
import ResultDisplay from './ResultDisplay';

const ContextOverlay = ({
    show,
    onClose,
    images,
    loading,
    error,
    handleImageClick,
    configuredImagesPerRow
}) => {
    if (!show) {
        return null;
    }

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
                <div className="w-full">
                    <ResultDisplay
                        imageUris={images}
                        loading={loading}
                        error={error}
                        groupByDay={false}
                        handleImageClick={handleImageClick}
                        configuredImagesPerRow={configuredImagesPerRow}
                    />
                </div>
            </div>
        </div>
    );
};

export default ContextOverlay;

