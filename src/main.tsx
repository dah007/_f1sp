import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { ThemeProvider } from './components/ui/theme-provider.tsx';

import './main.css';

createRoot(document.getElementById('root')!).render(
    <div className="min-h-screen min-w-screen p-0 m-0">
        <Provider store={store}>
            <StrictMode>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <App />
                </ThemeProvider>
            </StrictMode>
        </Provider>
    </div>,
);
