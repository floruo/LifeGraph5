import React from "react";

// Helper to check if a time string is valid (HH:mm or HH:mm:ss)
const isValidTime = (time) => /^\d{2}:\d{2}(:\d{2})?$/.test(time);
const clampTime = (time, minTime, maxTime) => {
    if (!isValidTime(time)) return minTime;
    if (time < minTime) return minTime;
    if (time > maxTime) return maxTime;
    return time;
};

export const getTimeBlock = (includeStartTime, includeEndTime, startTime, endTime, pushUnique) => {
    let timeClauses = [];
    let timePrefixes = [];
    if (includeStartTime || includeEndTime) {
        pushUnique(timePrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
        let filter = [];
        if (includeStartTime && includeEndTime) {
            filter.push(`?time >= "${startTime.length === 5 ? startTime + ':00' : startTime}" && ?time <= "${endTime.length === 5 ? endTime + ':00' : endTime}"`);
        } else if (includeStartTime) {
            filter.push(`?time >= "${startTime.length === 5 ? startTime + ':00' : startTime}"`);
        } else if (includeEndTime) {
            filter.push(`?time <= "${endTime.length === 5 ? endTime + ':00' : endTime}"`);
        }
        timeClauses.push(`  {\n    ?img lsc:local_time ?datetime .\n    BIND(SUBSTR(STR(?datetime), 12, 8) AS ?time)\n    FILTER (${filter.join(' && ')})\n  }`);
    }
    return { timeClauses, timePrefixes };
};

const TimeFilter = ({ minTime, maxTime, startTime, endTime, setStartTime, setEndTime, includeStartTime = false, setIncludeStartTime = () => {}, includeEndTime = false, setIncludeEndTime = () => {}, label = "Time" }) => {
    const handleStartTimeChange = (e) => {
        const val = e.target.value;
        if (val >= minTime && val <= maxTime) {
            setStartTime(val);
        }
    };
    const handleEndTimeChange = (e) => {
        const val = e.target.value;
        if (val >= minTime && val <= maxTime) {
            setEndTime(val);
        }
    };
    const handleIncludeStartTimeChange = (e) => {
        setIncludeStartTime(e.target.checked);
    };
    const handleIncludeEndTimeChange = (e) => {
        setIncludeEndTime(e.target.checked);
    };
    return (
        <div className="flex flex-col gap-2 mb-4">
            <div className="flex flex-row items-center gap-2">
                <input
                    id="include-start-time-checkbox"
                    type="checkbox"
                    checked={includeStartTime}
                    onChange={handleIncludeStartTimeChange}
                    className="mr-1"
                />
                <label className="text-xs font-medium mr-2 min-w-[40px] text-right" htmlFor="start-time">Start:</label>
                <input
                    id="start-time"
                    type="time"
                    min={minTime}
                    max={maxTime}
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className="w-full px-2 py-1 border rounded"
                />
            </div>
            <div className="flex flex-row items-center gap-2">
                <input
                    id="include-end-time-checkbox"
                    type="checkbox"
                    checked={includeEndTime}
                    onChange={handleIncludeEndTimeChange}
                    className="mr-1"
                />
                <label className="text-xs font-medium mr-2 min-w-[40px] text-right" htmlFor="end-time">End:</label>
                <input
                    id="end-time"
                    type="time"
                    min={minTime}
                    max={maxTime}
                    value={endTime}
                    onChange={handleEndTimeChange}
                    className="w-full px-2 py-1 border rounded"
                />
            </div>
            {/* Preset time range buttons */}
            <div className="grid grid-cols-4 gap-2 mt-2 items-center">
                <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs w-full" onClick={() => { setStartTime('06:00'); setEndTime('12:00'); setIncludeStartTime(true); setIncludeEndTime(true); }}>Morning</button>
                <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs w-full" onClick={() => { setStartTime('12:00'); setEndTime('18:00'); setIncludeStartTime(true); setIncludeEndTime(true); }}>Afternoon</button>
                <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs w-full" onClick={() => { setStartTime('18:00'); setEndTime('23:59'); setIncludeStartTime(true); setIncludeEndTime(true); }}>Evening</button>
                <button type="button" className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs w-full" onClick={() => { setStartTime('00:00'); setEndTime('06:00'); setIncludeStartTime(true); setIncludeEndTime(true); }}>Night</button>
            </div>
            <div className="flex justify-end mt-2">
                <button type="button" className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs" onClick={() => { setStartTime(minTime); setEndTime(maxTime); setIncludeStartTime(false); setIncludeEndTime(false); }}>Clear</button>
            </div>
        </div>
    );
};

export default TimeFilter;
