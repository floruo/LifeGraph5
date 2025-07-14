import React, { useState } from 'react';
import { LoginRequest, ApiClientSubmission, ApiClientAnswerSet, ApiClientAnswer } from '../openapi/DRES/client/src/index';
import { DRES_USER, DRES_PASSWORD, DRES_ENABLED } from '../config';
import { toast } from "react-toastify";

const onSuccess = (data) => {
    toast.success(`Submission successful: ${data.submission}`);
};

const onError = (error) => {
    toast.error(`Submission failed!`);
    console.log(error);
};

export const submitImage = (submissionApi, session, run, imageId) => {
    if (!DRES_ENABLED) return;

    const answer = new ApiClientAnswer();
    answer.mediaItemName = imageId;

    const answerSet = new ApiClientAnswerSet([answer]);

    const submission = new ApiClientSubmission([answerSet]);

    submissionApi.postApiV2SubmitByEvaluationId(
        run,
        submission,
        { session: session },
        (error, data, response) => {
            if (error) {
                onError(error.message);
            } else {
                onSuccess(data);
            }
        }
    )
};

export const DresSubmission = ({ submissionApi, dresSession, activeRun, imageId }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [text, setText] = useState('');

    const handleSubmitImage = () => {
        if (!imageId) {
            setSubmitError("No image selected to submit.");
            return;
        }

        submitImage(submissionApi, dresSession, activeRun, imageId);
    };

    const handleSubmitText = () => {
        const answer = new ApiClientAnswer();
        answer.text = text;

        const answerSet = new ApiClientAnswerSet([answer]);

        const submission = new ApiClientSubmission([answerSet]);

        submissionApi.postApiV2SubmitByEvaluationId(
            activeRun,
            submission,
            { session: dresSession },
            (error, data, response) => {
                if (error) {
                    onError(error.message);
                } else {
                    onSuccess(data);
                }
            }
        )
    };

    if (!DRES_ENABLED) return null;

    return (
        <div className="flex flex-col gap-2 items-end">
            <button
                className="px-2 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition disabled:bg-gray-400 text-xs"
                onClick={handleSubmitImage}
                disabled={isSubmitting || !dresSession || !activeRun}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Image'}
            </button>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="border rounded px-2 py-1 flex-grow text-xs"
                    placeholder="Enter text"
                />
                <button
                    className="px-2 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition disabled:bg-gray-400 text-xs"
                    onClick={handleSubmitText}
                    disabled={isSubmitting || !dresSession || !activeRun}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Text'}
                </button>
            </div>
            {submitError && <p className="text-red-500 text-xs">{submitError}</p>}
            {submitSuccess && <p className="text-green-500 text-xs">Submission successful!</p>}
        </div>
    );
};

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

    if (!DRES_ENABLED) return null;

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
                            value={activeRun || ''}
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
