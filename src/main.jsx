import { Auth0Provider } from '@auth0/auth0-react';
import ErrorBoundary from '@components/ErrorBoundary.jsx';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const domain = 'dev-73y3t7dwltn1cjsd.us.auth0.com';
const clientId = 'yKZnXvqXQMqtEzWyGTeZcaD26QJ87kl7';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
            }}
        >
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </Auth0Provider>
    </React.StrictMode>
)
