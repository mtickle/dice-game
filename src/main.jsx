import { Auth0Provider } from '@auth0/auth0-react';
import ErrorBoundary from '@components/ErrorBoundary.jsx';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI;


createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
            }}
            cacheLocation="localstorage"
            useRefreshTokens={true}
        >
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </Auth0Provider>
    </React.StrictMode>
)
