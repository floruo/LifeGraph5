import React, { useState } from 'react';
import { LoginRequest } from '../openapi/DRES/client/src/index';
import { DRES_USER, DRES_PASSWORD } from '../config';

export const DresLogin = ({ userApi, runInfoApi, dresSession, setDresSession, activeRun, setActiveRun }) => {
    const [error, setError] = useState(null);
    const [evaluationRuns, setEvaluationRuns] = useState([]);

    const handleLogin = () => {
        const loginRequest = new LoginRequest(DRES_USER, DRES_PASSWORD);
        userApi.postApiV2Login({ loginRequest }, (error, data, response) => {
            if (error) {
                setError(error.message);
                setDresSession('');
            } else {
                setError(null);
                setDresSession(data.sessionId);
                refreshEvaluationRuns(data.sessionId);
            }
        });
    };

    const handleLogout = () => {
        userApi.getApiV2Logout({
            sessionId: dresSession
        }, (error, data, response) => {
            if (error) {
                setError(error.message);
            } else {
                setError(null);
                setDresSession('');
                setEvaluationRuns([]);
            }
        });
    };

    const refreshEvaluationRuns = (sessionId) => {
        runInfoApi.getApiV2ClientEvaluationList(
            { session: sessionId },
            (error, data, response) => {
                if (error) {
                    setError(error.message);
                    setEvaluationRuns([]);
                    return;
                }

                if (!data || data.length === 0) {
                    setError("No runs available");
                    setEvaluationRuns([]);
                } else {
                    setError(null);
                    setEvaluationRuns(data);
                    if (!activeRun && data.length > 0) {
                        setActiveRun(data[0].id);
                    }
                }
            }
        );
    }

    return (
        <div className="flex flex-col gap-2 max-w-xs w-full">
            {error && <p className="text-red-500 text-xs">{error}</p>}
            {dresSession ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <p className="text-green-700 text-sm font-semibold">{DRES_USER}</p>
                        <label htmlFor="run-select" className="text-sm"></label>
                        <select
                            id="run-select"
                            value={activeRun}
                            onChange={(e) => setActiveRun(e.target.value)}
                            className="flex-grow p-1 border rounded text-xs"
                        >
                            {evaluationRuns.map(run => (
                                <option key={run.id} value={run.id}>{run.name}</option>
                            ))}
                        </select>
                        <button
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded shadow hover:bg-blue-200 transition text-xs"
                            onClick={() => refreshEvaluationRuns(dresSession)}
                            title="Refresh runs"
                        >
                            &#x21bb;
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className="px-2 py-1 bg-green-100 text-green-700 rounded shadow hover:bg-green-200 transition text-xs ml-auto"
                    onClick={handleLogin}
                >
                    DRES LOGIN
                </button>
            )}
        </div>
    );
};
