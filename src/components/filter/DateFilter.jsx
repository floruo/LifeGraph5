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

const DateFilter = ({ minDate, maxDate, startDate, endDate, setStartDate, setEndDate, includeStartDay, setIncludeStartDay, includeEndDay, setIncludeEndDay, fetchDayRange, onDayChange, rangeType, setRangeType, customDays, setCustomDays, selectedWeekdays, setSelectedWeekdays, weekdayRange, setWeekdayRange, selectedYears, setSelectedYears, selectedMonths, setSelectedMonths, loadingDayRange }) => {
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
        if (val >= minDate && val <= maxDate) {
            setStartDate(val);
        }
    };
    const handleEndChange = (e) => {
        const val = e.target.value;
        if (val >= minDate && val <= maxDate) {
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

    // Helper to clear all selected years
    const handleClearYears = () => setSelectedYears([]);
    // Helper to clear all selected months
    const handleClearMonths = () => {
        setSelectedMonths([]);
        setMonthRange([null, null]);
    };
    // Helper to clear all selected weekdays
    const handleClearWeekdays = () => {
        setSelectedWeekdays([]);
        setWeekdayRange([null, null]);
    };

    // Helper to add days or months to a date string (yyyy-mm-dd)
    const addDaysOrMonth = (dateStr, days, addMonth = false) => {
        const d = new Date(dateStr);
        if (addMonth) {
            d.setMonth(d.getMonth() + 1);
        } else {
            d.setDate(d.getDate() + days);
        }
        return d.toISOString().slice(0, 10);
    };

    // Update end date when rangeType or startDate changes
    React.useEffect(() => {
        if (rangeType === 'none') return;
        let days = 0;
        let addMonth = false;
        if (rangeType === '0') days = 0;
        else if (rangeType === '1') days = 1;
        else if (rangeType === '7') days = 7;
        else if (rangeType === '30') addMonth = true;
        else if (rangeType === 'custom') days = Number(customDays) || 0;
        const newEnd = addDaysOrMonth(startDate, days, addMonth);
        if (isValidDate(newEnd) && newEnd <= maxDate) {
            setEndDate(newEnd);
            if (includeStartDay && !includeEndDay) setIncludeEndDay(true); // only auto-check end if start is checked
        } else if (isValidDate(newEnd) && newEnd > maxDate) {
            setEndDate(maxDate);
            if (includeStartDay && !includeEndDay) setIncludeEndDay(true);
        }
    }, [rangeType, customDays, startDate]);

    const handleRefreshDayRange = () => {
        setStartDate(minDate);
        setEndDate(maxDate);
        setIncludeStartDay(false);
        setIncludeEndDay(false);
        setRangeType('none');
        setCustomDays(1)
        handleClearYears();
        handleClearMonths();
        setSelectedWeekdays([]);

        fetchDayRange(true);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row items-center gap-2 mb-2">
                <button
                    className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300"
                    onClick={handleRefreshDayRange}
                    type="button"
                >
                    Refresh Date Range
                </button>
            </div>
            {loadingDayRange ? (
                <div className="mb-4 w-full text-xs text-gray-400 text-left">Loading ...</div>
            ) : (
                <>
                    <div className="flex flex-row items-center gap-2 mb-2">
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
                    {/* New: Range selector below start date, aligned with date fields */}
                    <div className="flex flex-row items-center gap-2 mb-2">
                        <span className="text-xs font-medium mr-2 min-w-[40px] text-right">Range:</span>
                        <select
                            className="w-full px-2 py-1 border rounded text-xs"
                            value={rangeType}
                            onChange={e => setRangeType(e.target.value)}
                        >
                            <option value="none">Set range...</option>
                            <option value="0">+0 days</option>
                            <option value="1">+1 day</option>
                            <option value="7">+1 week</option>
                            <option value="30">+1 month</option>
                            <option value="custom">Custom days</option>
                        </select>
                        {rangeType === 'custom' && (
                            <input
                                type="number"
                                min="0"
                                max="365"
                                value={customDays}
                                onChange={e => setCustomDays(e.target.value)}
                                className="ml-1 w-16 px-1 py-1 border rounded text-xs"
                                placeholder="days"
                            />
                        )}
                    </div>
                    <div className="flex flex-row items-center gap-2 mb-4">
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
                    {/* Year selector UI below date fields but above months */}
                    <div className="flex flex-wrap gap-2 w-full mb-2">
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
                    <div className="flex flex-col gap-2 mb-2">
                        <div className="flex flex-wrap gap-2 w-full">
                            {months.map((month, idx) => (
                                <button
                                    key={month}
                                    type="button"
                                    title="Select individual months or a range (Shift+Click for range)"
                                    className={`px-2 py-1 rounded border text-xs flex-1 text-center ${selectedMonths.includes(idx + 1) ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300'}`}
                                    onClick={e => handleMonthToggle(idx + 1, e)}
                                >
                                    {month.slice(0,3)}
                                </button>
                            ))}
                        </div>
                        <div className="flex w-full justify-end">
                            <button
                                className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs"
                                onClick={handleClearMonths}
                                type="button"
                                title="Clear all months"
                            >
                                Clear Month
                            </button>
                        </div>
                    </div>
                    {/* Weekday selector UI below months */}
                    <div className="flex flex-col gap-2 mb-2">
                        <div className="grid grid-cols-7 gap-2 w-full">
                            {weekdays.map((day, idx) => (
                                <button
                                    key={day}
                                    type="button"
                                    title="Select individual days or a range (Shift+Click for range)"
                                    className={`px-2 py-1 rounded border text-xs text-center w-full ${selectedWeekdays.includes(day) ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300'}`}
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
                        <div className="flex w-full justify-end">
                            <button
                                className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs"
                                onClick={handleClearWeekdays}
                                type="button"
                                title="Clear all days"
                            >
                                Clear Day
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Returns SPARQL date filter block and prefixes
export const getDateBlock = (includeStartDay, includeEndDay, startDay, endDay, selectedWeekdays, selectedYears, selectedMonths, pushUnique) => {
    let dateClauses = [];
    let datePrefixes = [];
    if (
        includeStartDay || includeEndDay ||
        (selectedWeekdays && selectedWeekdays.length > 0) ||
        (selectedYears && selectedYears.length > 0) ||
        (selectedMonths && selectedMonths.length > 0)
    ) {
        pushUnique(datePrefixes, 'PREFIX lsc: <http://lsc.dcu.ie/schema#>');
        pushUnique(datePrefixes, 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>');
        if (selectedWeekdays && selectedWeekdays.length > 0) {
            pushUnique(datePrefixes, 'PREFIX megras: <http://megras.org/sparql#>');
        }
        let dateBlock = [
            '    ?img lsc:day ?day .',
            '    BIND(xsd:date(STRAFTER(STR(?day), "#")) AS ?dayDate)'
        ];
        if (includeStartDay && includeEndDay) {
            dateBlock.push(`    FILTER (?dayDate >= "${startDay}"^^xsd:date && ?dayDate <= "${endDay}"^^xsd:date)`);
        } else if (includeStartDay) {
            dateBlock.push(`    FILTER (?dayDate >= "${startDay}"^^xsd:date)`);
        } else if (includeEndDay) {
            dateBlock.push(`    FILTER (?dayDate <= "${endDay}"^^xsd:date)`);
        }
        if (selectedWeekdays && selectedWeekdays.length > 0) {
            const weekdayMap = {
                'Monday': 1,
                'Tuesday': 2,
                'Wednesday': 3,
                'Thursday': 4,
                'Friday': 5,
                'Saturday': 6,
                'Sunday': 7
            };
            const selectedNumbers = selectedWeekdays.map(day => weekdayMap[day]);
            dateBlock.push(`    FILTER (megras:DAYOFWEEK(?dayDate) IN (${selectedNumbers.join(", ")}))`);
        }
        if (selectedYears && selectedYears.length > 0) {
            const yearFilters = selectedYears.map(y => `YEAR(?dayDate) = ${y}`).join(' || ');
            dateBlock.push(`    FILTER (${yearFilters})`);
        }
        if (selectedMonths && selectedMonths.length > 0) {
            dateBlock.push(`    FILTER (MONTH(?dayDate) IN (${selectedMonths.join(", ")}))`);
        }
        dateClauses.push(`  {\n${dateBlock.join('\n')}\n  }`);
    }
    return { dateClauses, datePrefixes };
};

export default DateFilter;
