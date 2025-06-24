import React from "react";

const SparqlQueryArea = ({ showSparql, setShowSparql, liveSparqlQuery }) => (
  <div className="w-full">
    <button
      className="flex items-center gap-2 text-xs text-blue-700 hover:underline focus:outline-none mb-1"
      onClick={() => setShowSparql(v => !v)}
      type="button"
    >
      {showSparql ? '▼ Hide SPARQL Query' : '► Show SPARQL Query'}
    </button>
    {showSparql && (
      <div className="w-full bg-white border border-gray-200 rounded p-2 mb-2 text-xs font-mono text-gray-700 whitespace-pre-wrap break-all">
        {liveSparqlQuery || <span className="text-gray-400 italic">No query constructed.</span>}
      </div>
    )}
  </div>
);

export default SparqlQueryArea;

