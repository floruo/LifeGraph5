
// Returns SPARQL clip similarity filter block and prefixes
import React from "react";


export const getClipSimilarityBlock = (clipSimilarityText, clipSimilarityThreshold, pushUnique) => {
    let similarityClauses = [];
    let similarityPrefixes = [];
    if (clipSimilarityText) {
        pushUnique(similarityPrefixes, 'PREFIX megras: <http://megras.org/sparql#>');
        pushUnique(similarityPrefixes, 'PREFIX derived: <http://megras.org/derived/>');
        pushUnique(similarityPrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
        similarityClauses.push(`  {`);
        similarityClauses.push(`    BIND (megras:CLIP_TEXT(\"${clipSimilarityText.replace(/\"/g, '\\\"')}\") as ?textVec)`);
        similarityClauses.push(`    ?img derived:clipEmbedding ?clipVec .`);
        similarityClauses.push(`    FILTER (megras:COSINE_SIM(?textVec, ?clipVec) > ${clipSimilarityThreshold})`);
        similarityClauses.push(`  }`);
    }
    return { similarityClauses, similarityPrefixes };
};

// Clip Similarity Filter Component
const ClipFilter = ({ clipSimilarityText, setClipSimilarityText, clipSimilarityThreshold = 0.8, setClipSimilarityThreshold, loading }) => (
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
            <span className="text-xs text-gray-500 whitespace-nowrap">Threshold</span>
            <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                value={clipSimilarityThreshold}
                onChange={e => setClipSimilarityThreshold && setClipSimilarityThreshold(Number(e.target.value) > 1 ? 1 : Number(e.target.value) < 0 ? 0 : Number(e.target.value))}
                //disabled={loading}
                title="Similarity threshold (0-1)"
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