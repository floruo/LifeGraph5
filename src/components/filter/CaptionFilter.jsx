import React from "react";

const CaptionFilter = ({ selectedCaption, setSelectedCaption, loading }) => (
  <div className="w-full flex flex-col gap-2 mb-2">
    <div className="flex flex-row items-center gap-2">
      <input
        type="text"
        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
        placeholder="Search caption..."
        value={selectedCaption}
        onChange={e => setSelectedCaption(e.target.value)}
        disabled={loading}
      />
    </div>
    <div className="flex w-full justify-end">
        <button
         className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs w-fit"
         onClick={() => setSelectedCaption('')}
         //disabled={loading || !selectedCaption}
         type="button"
        >
        Clear Caption
        </button>
    </div>
  </div>
);

export default CaptionFilter;
