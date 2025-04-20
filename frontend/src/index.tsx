import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
		<Auth0Provider
			domain={import.meta.env.VITE_AUTH0_DOMAIN as string} // Replace with your actual Auth0 domain from .env
			clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string} // Replace with your actual Auth0 client ID from .env
			authorizationParams={{
			redirect_uri: window.location.origin,
			scope: "openid profile email"
			}}
			cacheLocation="localstorage" // This is crucial for persistence across page reloads
			useRefreshTokens={true} // Enable refresh tokens for longer sessions
		>
			<App />
		</Auth0Provider>
  </React.StrictMode>
);
