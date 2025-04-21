import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';

createRoot(document.getElementById('root')!).render(
    <div className="min-h-screen min-w-screen p-0 m-0 bg-gray-200">
        <Provider store={store}>
            <StrictMode>
                <App />
            </StrictMode>
        </Provider>
    </div>,
);
