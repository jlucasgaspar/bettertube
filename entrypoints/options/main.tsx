import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from '../../lib/app-context';
import '../../assets/app.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
