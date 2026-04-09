import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const renderMissingClientId = () => {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

  return (
    <StrictMode>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-xl rounded-2xl border border-red-200 bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-semibold text-red-700 mb-4">Google OAuth setup is incomplete</h1>
          <p className="text-sm text-slate-700 mb-4">
            The application needs a valid Google OAuth client ID to initialize. Create a `.env` file in the project root with:
          </p>
          <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-left text-xs text-slate-800">VITE_GOOGLE_CLIENT_ID=your_google_client_id_here</pre>
          <p className="text-sm text-slate-700 mt-4">
            Also make sure your Google OAuth client has this origin authorized:
          </p>
          <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-left text-xs text-slate-800">{currentOrigin}</pre>
          <p className="text-sm text-slate-700 mt-4">
            Then restart the app. If you already have a client ID, make sure it is correctly loaded by Vite.
          </p>
        </div>
      </div>
    </StrictMode>
  );
};

if (!GOOGLE_CLIENT_ID) {
  console.error('Missing VITE_GOOGLE_CLIENT_ID. Add your Google OAuth client ID to .env and restart the app.');
  createRoot(document.getElementById('root')!).render(renderMissingClientId());
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </StrictMode>,
  );
}