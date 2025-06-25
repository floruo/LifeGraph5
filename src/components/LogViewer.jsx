import React from 'react';

const LogViewer = ({ logs, onClear, onClose, position = 'bottom' }) => {
    const downloadLogs = () => {
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sparql-logs-${new Date().toISOString().replace(/:/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`fixed ${position === 'top' ? 'top-20' : 'bottom-4'} right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm w-full z-50`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Query Logs</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="h-48 overflow-y-auto bg-gray-100 p-2 rounded">
                <pre className="text-xs">{JSON.stringify(logs, null, 2)}</pre>
            </div>
            <div className="mt-2 flex justify-end gap-2">
                <button
                    onClick={downloadLogs}
                    className="px-3 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition text-xs"
                >
                    Download
                </button>
                <button
                    onClick={onClear}
                    className="px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition text-xs"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default LogViewer;
