
// Returns SPARQL clip similarity filter block and prefixes
import React from "react";


export const getClipSimilarityBlock = (clipSimilarityText, clipSimilarityK, pushUnique) => {
    let similarityClauses = [];
    let similarityPrefixes = [];
    let similarityEndblock = [];
    if (clipSimilarityText) {
        pushUnique(similarityPrefixes, 'PREFIX megras: <http://megras.org/sparql#>');
        pushUnique(similarityPrefixes, 'PREFIX derived: <http://megras.org/derived/>');
        pushUnique(similarityPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
        similarityClauses.push(`  {`);
        similarityClauses.push(`    BIND (megras:CLIP_TEXT(\"${clipSimilarityText.replace(/\"/g, '\\\"')}\") as ?textVec)`);
        similarityClauses.push(`    ?img derived:clipEmbedding ?clipVec .`);
        similarityClauses.push(`    BIND (megras:COSINE_SIM(?textVec, ?clipVec) as ?cosSim)`);
        similarityClauses.push(`  }`);
        similarityEndblock.push(`ORDER BY DESC(?cosSim) ?id`);
        similarityEndblock.push(`LIMIT ${clipSimilarityK}`);
    }
    return { similarityClauses, similarityPrefixes, similarityEndblock };
};

// Clip Similarity Filter Component
const ClipFilter = ({ clipSimilarityText, setClipSimilarityText, clipSimilarityK = 5, setClipSimilarityK, loading }) => (
    <div className="w-full flex flex-col gap-2 mb-2">
        <div className="flex flex-row items-center gap-2">
            <input
                type="text"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Search similar CLIP embedding..."
                value={clipSimilarityText}
                onChange={e => setClipSimilarityText(e.target.value)}
                disabled={loading}
            />
        </div>
        <div className="flex flex-row items-center gap-2 w-full">
            <span className="text-xs text-gray-500 whitespace-nowrap">K</span>
            <input
                type="number"
                min={1}
                max={500}
                step={1}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                value={clipSimilarityK}
                onChange={e => setClipSimilarityK && setClipSimilarityK(Number(e.target.value) > 500 ? 500 : Number(e.target.value) < 1 ? 1 : Number(e.target.value))}
                //disabled={loading}
                title="K for CLIP NN"
            />
            <div className="flex-1" />
            <button
                className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs w-fit"
                onClick={() => setClipSimilarityText('')}
                type="button"
            >
                Clear Similarity
            </button>
        </div>
    </div>
);

export default ClipFilter;