import React, { useState, useEffect } from 'react';
import TagSelector from './selector/TagSelector.jsx';
import CountrySelector from './selector/CountrySelector.jsx';
import CategorySelector from './selector/CategorySelector.jsx';
import CitySelector from './selector/CitySelector.jsx';
import LocationSelector from './selector/LocationSelector.jsx';
import DateFilter from './filter/DateFilter.jsx';
import TimeFilter from './filter/TimeFilter.jsx';
import CaptionFilter from './filter/CaptionFilter.jsx';
import OcrFilter from './filter/OcrFilter.jsx';
import ClipFilter from './filter/ClipFilter.jsx';

export const CollapsiblePanel = ({ title, children, defaultOpen = false, className = "", forceCollapse, active = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    useEffect(() => {
        if (forceCollapse === true) setOpen(false);
    }, [forceCollapse]);
    return (
        <div className={`bg-gray-50 rounded-lg shadow-md p-4 w-full max-w-xs flex flex-col items-start ${className}`}>
            <button
                className="mb-2 text-sm font-semibold text-blue-700 hover:underline focus:outline-none flex items-center justify-between w-full gap-2"
                onClick={() => setOpen(o => !o)}
                type="button"
            >
                <span className="flex items-center gap-2">{open ? '▼' : '►'} {title}</span>
                {active && <span className="w-2 h-2 rounded-full bg-green-500 inline-block ml-2" title="Filter active"></span>}
            </button>
            {open && <div className="w-full">{children}</div>}
        </div>
    );
};

export const renderFilterPanel = (type, props) => {
    // Always pass CollapsiblePanel from this file
    const { collapseAllFilters } = props;
    // Determine if the filter is active
    const isActive = (() => {
        switch (type) {
            case 'tags':
                return Array.isArray(props.selectedTags) && props.selectedTags.length > 0;
            case 'country':
                return !!props.selectedCountry;
            case 'city':
                return !!props.selectedCity;
            case 'date':
                return (props.startDate && props.startDate !== props.minDate) || (props.endDate && props.endDate !== props.maxDate) || props.includeStartDay || props.includeEndDay || (props.rangeType && props.rangeType !== 'none') || (Array.isArray(props.selectedYears) && props.selectedYears.length > 0) || (Array.isArray(props.selectedMonths) && props.selectedMonths.length > 0) || (Array.isArray(props.selectedWeekdays) && props.selectedWeekdays.length > 0);
            case 'time':
                return (props.startTime && props.startTime !== props.minTime) || (props.endTime && props.endTime !== props.maxTime) || props.includeStartTime || props.includeEndTime;
            case 'category':
                return Array.isArray(props.selectedCategories) && props.selectedCategories.length > 0;
            case 'location':
                return !!props.selectedLocation;
            case 'caption':
                return !!props.selectedCaption;
            case 'ocr':
                return !!props.selectedOcr;
            default:
                return false;
        }
    })();
    switch (type) {
        case 'tags':
            return (
                <CollapsiblePanel title="Tags" forceCollapse={collapseAllFilters} active={isActive}>
                    <TagSelector
                        {...props}
                        fetchAllTags={(force = false) => props.setForceFetchTags(force)}
                    />
                </CollapsiblePanel>
            );
        case 'country':
            return (
                <CollapsiblePanel title="Country" forceCollapse={collapseAllFilters} active={isActive}>
                    <CountrySelector
                        {...props}
                        fetchAllCountries={(force = false) => props.setForceFetchCountries(force)}
                    />
                </CollapsiblePanel>
            );
        case 'city':
            return (
                <CollapsiblePanel title="City" forceCollapse={collapseAllFilters} active={isActive}>
                    <CitySelector
                        {...props}
                        fetchAllCities={(force = false) => props.setForceFetchCities(force)}
                    />
                </CollapsiblePanel>
            );
        case 'date':
            return (
                <CollapsiblePanel title="Date" forceCollapse={collapseAllFilters} active={isActive}>
                    <DateFilter {...props} />
                </CollapsiblePanel>
            );
        case 'time':
            return (
                <CollapsiblePanel title="Time" forceCollapse={collapseAllFilters} active={isActive}>
                    <TimeFilter {...props} />
                </CollapsiblePanel>
            );
        case 'category':
            return (
                <CollapsiblePanel title="Category" forceCollapse={collapseAllFilters} active={isActive}>
                    <CategorySelector
                        {...props}
                        fetchAllCategories={(force = false) => props.setForceFetchCategories(force)}
                    />
                </CollapsiblePanel>
            );
        case 'location':
            return (
                <CollapsiblePanel title="Location" forceCollapse={collapseAllFilters} active={isActive}>
                    <LocationSelector
                        {...props}
                        fetchAllLocations={(force = false) => props.setForceFetchLocations(force)}
                    />
                </CollapsiblePanel>
            );
        case 'caption':
            return (
                <CollapsiblePanel title="Caption" forceCollapse={collapseAllFilters} active={isActive}>
                    <CaptionFilter {...props} />
                </CollapsiblePanel>
            );
        case 'ocr':
            return (
                <CollapsiblePanel title="OCR" forceCollapse={collapseAllFilters} active={isActive}>
                    <OcrFilter {...props} />
                </CollapsiblePanel>
            );
        case 'clip':
            return (
                <CollapsiblePanel title="CLIP" forceCollapse={collapseAllFilters} active={isActive}>
                    <ClipFilter {...props} />
                </CollapsiblePanel>
            );
        default:
            return null;
    }
};
