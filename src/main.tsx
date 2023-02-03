import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { PathFinderContextProvider } from './utilities/PathFinderContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PathFinderContextProvider>
      <App />
    </PathFinderContextProvider>
  </React.StrictMode>
);
