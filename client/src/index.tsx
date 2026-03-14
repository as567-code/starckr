import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AlertProvider } from './util/context/AlertContext.tsx';

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <AlertProvider>
    <App />
  </AlertProvider>,
);
