import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; // Update to '.tsx' if necessary
 // Update to '.ts' if necessary

import { Provider } from 'react-redux';
import { MyStore } from './redux/store';

// TypeScript needs a type assertion here
const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={MyStore}>
      <App />
    </Provider>
  </StrictMode>,
);
