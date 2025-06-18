import React from "react";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeekdaySelector({ selectedWeekdays, setSelectedWeekdays, weekdayRange, setWeekdayRange }) {
  const handleWeekdayRangeChange = (startIdx, endIdx) => {
    let range = [];
    if (startIdx <= endIdx) {
      range = weekdays.slice(startIdx, endIdx + 1);
    } else {
      range = [...weekdays.slice(startIdx), ...weekdays.slice(0, endIdx + 1)];
    }
    setSelectedWeekdays(range);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
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
      <button
        type="button"
        className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 text-xs"
        onClick={() => { setSelectedWeekdays([]); setWeekdayRange([null, null]); }}
      >
        Clear Weekdays
      </button>
    </div>
  );
}

