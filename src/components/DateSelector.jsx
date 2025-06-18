import React from 'react';

const DateSelector = ({ minDate, maxDate, startDate, endDate, setStartDate, setEndDate, includeStartDay, setIncludeStartDay, includeEndDay, setIncludeEndDay, onRefreshDayRange, onDayChange }) => {
    // Helper to format date for input[type="range"]
    const toInputValue = (date) => date.split('-').join('');
    const fromInputValue = (val) => {
        const s = val.toString();
        return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
    };

    // Helper to check if a date string is valid (yyyy-mm-dd)
    const isValidDate = (date) => {
        const d = new Date(date);
        return date.match(/^\d{4}-\d{2}-\d{2}$/) && !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date;
    };

    // Clamp a date to the min/max range and ensure validity
    const clampDate = (date) => {
        if (!isValidDate(date)) return minDate;
        if (date < minDate) return minDate;
        if (date > maxDate) return maxDate;
        return date;
    };

    // Convert dates to numbers for range input
    const min = Number(toInputValue(minDate));
    const max = Number(toInputValue(maxDate));
    const start = Number(toInputValue(clampDate(startDate)));
    const end = Number(toInputValue(clampDate(endDate)));

    // Remove automated query trigger on change
    const handleStartChange = (e) => {
        const val = e.target.value;
        if (val <= endDate && val >= minDate && val <= maxDate) {
            setStartDate(val);
        }
    };
    const handleEndChange = (e) => {
        const val = e.target.value;
        if (val >= startDate && val >= minDate && val <= maxDate) {
            setEndDate(val);
        }
    };
    const handleIncludeStartDayChange = (e) => {
        setIncludeStartDay(e.target.checked);
    };
    const handleIncludeEndDayChange = (e) => {
        setIncludeEndDay(e.target.checked);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row items-center gap-2 mb-2">
                <button
                    className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300"
                    onClick={onRefreshDayRange}
                    type="button"
                >
                    Refresh Date Range
                </button>
            </div>
            <div className="flex flex-row items-center gap-2">
                <input
                    id="include-start-checkbox"
                    type="checkbox"
                    checked={includeStartDay}
                    onChange={handleIncludeStartDayChange}
                    className="mr-1"
                />
                <label className="text-xs font-medium mr-2 min-w-[40px] text-right" htmlFor="start-date">Start:</label>
                <input
                    id="start-date"
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={startDate}
                    onChange={handleStartChange}
                    className="w-full px-2 py-1 border rounded"
                />
            </div>
            <div className="flex flex-row items-center gap-2">
                <input
                    id="include-end-checkbox"
                    type="checkbox"
                    checked={includeEndDay}
                    onChange={handleIncludeEndDayChange}
                    className="mr-1"
                />
                <label className="text-xs font-medium mr-2 min-w-[40px] text-right" htmlFor="end-date">End:</label>
                <input
                    id="end-date"
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={endDate}
                    onChange={handleEndChange}
                    className="w-full px-2 py-1 border rounded"
                />
            </div>
        </div>
    );
};

export default DateSelector;
