import React from "react";

const SparqlQueryArea = ({ showSparql, setShowSparql, liveSparqlQuery, onClear }) => {
    if (!showSparql) return null;

    return (
        <div className="fixed bottom-28 right-4 bg-white p-4 rounded-lg shadow-lg w-[900px] max-w-3xl z-50">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">SPARQL Query</h3>
                <button
                    onClick={() => setShowSparql(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="overflow-x-auto overflow-y-auto bg-gray-100 p-2 rounded mb-2 max-h-[80vh]">
                <pre className="text-xs font-mono text-gray-700 whitespace-pre">
                    {liveSparqlQuery || <span className="text-gray-400 italic">No query constructed.</span>}
                </pre>
            </div>
        </div>
    );
};

export default SparqlQueryArea;
