import React from 'react';

const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const DateSelector = ({ minDate, maxDate, startDate, endDate, setStartDate, setEndDate, includeStartDay, setIncludeStartDay, includeEndDay, setIncludeEndDay, onRefreshDayRange, onDayChange, selectedWeekdays, setSelectedWeekdays, weekdayRange, setWeekdayRange, selectedYears, setSelectedYears, selectedMonths, setSelectedMonths }) => {
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

    // Weekday selector logic
    const handleWeekdayRangeChange = (startIdx, endIdx) => {
        let range = [];
        if (startIdx <= endIdx) {
            range = weekdays.slice(startIdx, endIdx + 1);
        } else {
            range = [...weekdays.slice(startIdx), ...weekdays.slice(0, endIdx + 1)];
        }
        setSelectedWeekdays(range);
    };

    // Extract years from minDate and maxDate
    const minYear = parseInt(minDate.slice(0, 4), 10);
    const maxYear = parseInt(maxDate.slice(0, 4), 10);
    const years = [];
    for (let y = minYear; y <= maxYear; y++) years.push(y);

    // Helper to update selected years (multi-select/deselect)
    const handleYearToggle = (year) => {
        setSelectedYears(prev =>
            prev.includes(year)
                ? prev.filter(y => y !== year)
                : [...prev, year]
        );
    };

    // Month selector logic
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // Range selection state for months
    const [monthRange, setMonthRange] = React.useState([null, null]);
    // Helper for range selection
    const handleMonthToggle = (monthIdx, e) => {
        if (e.shiftKey && monthRange[0] !== null) {
            setMonthRange([monthRange[0], monthIdx]);
            // Select range (inclusive of both ends)
            let range = [];
            if (monthRange[0] <= monthIdx) {
                range = Array.from({length: monthIdx - monthRange[0] + 1}, (_, i) => monthRange[0] + i);
            } else {
                range = [
                    ...Array.from({length: 12 - monthRange[0] + 1}, (_, i) => monthRange[0] + i),
                    ...Array.from({length: monthIdx}, (_, i) => i + 1)
                ];
            }
            // Ensure start month is included
            if (!range.includes(monthRange[0])) {
                range.unshift(monthRange[0]);
            }
            setSelectedMonths(Array.from(new Set(range)));
        } else {
            setMonthRange([monthIdx, null]);
            setSelectedMonths(prev =>
                prev.includes(monthIdx)
                    ? prev.filter(m => m !== monthIdx)
                    : [...prev, monthIdx]
            );
        }
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
            {/* Year selector UI below date fields but above weekdays */}
            <div className="flex flex-wrap gap-2 mt-2 mb-2 w-full">
                {years.map(year => (
                    <button
                        key={year}
                        type="button"
                        className={`px-2 py-1 rounded border text-xs flex-1 text-center ${selectedYears.includes(year) ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300'}`}
                        onClick={() => handleYearToggle(year)}
                    >
                        {year}
                    </button>
                ))}
            </div>
            {/* Month selector UI below year fields but above weekdays */}
            <div className="flex flex-wrap gap-2 mt-2 mb-2 w-full">
                {months.map((month, idx) => (
                    <button
                        key={month}
                        type="button"
                        title="Select individual months or a range (Shift+Click for range)"
                        className={`px-2 py-1 rounded border text-xs flex-1 text-center ${selectedMonths.includes(idx + 1) ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300'} ${monthRange[0] === idx + 1 || monthRange[1] === idx + 1 ? 'ring-2 ring-blue-400' : ''}`}
                        onClick={e => handleMonthToggle(idx + 1, e)}
                    >
                        {month.slice(0,3)}
                    </button>
                ))}
            </div>
            {/* Weekday selector UI below date fields */}
            <div className="flex flex-wrap gap-2 mt-2">
                {weekdays.map((day, idx) => (
                    <button
                        key={day}
                        type="button"
                        title="Select individual days or a range (Shift+Click for range)"
                        className={`px-2 py-1 rounded border text-xs w-8 text-center ${selectedWeekdays.includes(day) ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300'} ${weekdayRange[0] === idx || weekdayRange[1] === idx ? 'ring-2 ring-blue-400' : ''}`}
                        onClick={e => {
                            if (e.shiftKey && weekdayRange[0] !== null) {
                                setWeekdayRange([weekdayRange[0], idx]);
                                handleWeekdayRangeChange(weekdayRange[0], idx);
                            } else {
                                setWeekdayRange([idx, null]);
                                setSelectedWeekdays(prev =>
                                    prev.includes(day)
                                        ? prev.filter(d => d !== day)
                                        : [...prev, day]
                                );
                            }
                        }}
                    >
                        {day.slice(0,2).toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DateSelector;
