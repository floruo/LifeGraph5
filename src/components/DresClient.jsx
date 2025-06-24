import React, { useState } from 'react';
import { LoginRequest } from '../openapi/DRES/client/src/index';
import { DRES_USER, DRES_PASSWORD } from '../config';

export const DresLogin = ({ userApi, dresSession, setDresSession }) => {
    const [error, setError] = useState(null);

    const handleLogin = () => {
        const loginRequest = new LoginRequest(DRES_USER, DRES_PASSWORD);
        userApi.postApiV2Login({ loginRequest }, (error, data, response) => {
            if (error) {
                setError(error.message);
                setDresSession('');
            } else {
                setError(null);
                setDresSession(data.sessionId);
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
            }
        });
    };

    return (
        <div className="flex flex-col gap-6 max-w-xs w-full">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {dresSession ? (
                <button
                    className="px-2 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-xs ml-auto"
                    onClick={handleLogout}
                >
                    DRES LOGOUT
                </button>
            ) : (
            /*    <button
                    className="px-2 py-1 bg-green-100 text-green-700 rounded shadow hover:bg-green-200 transition text-xs ml-auto"
                    onClick={handleLogin}
                >
                    DRES LOGIN
                </button>*/
                <p style={{ color: 'green' }}>Logged in as {DRES_USER}</p>
            )}
        </div>
    );
};
