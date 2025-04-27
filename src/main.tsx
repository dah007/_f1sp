import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { ThemeProvider } from './components/ui/theme-provider.tsx';

import './main.css';

const root = document.getElementById('root') as HTMLElement;

createRoot(root).render(
    <Provider store={store}>
        <StrictMode>
            <ThemeProvider defaultTheme="dark" storageKey="f1sp-theme">
                <App />
            </ThemeProvider>
        </StrictMode>
    </Provider>,
);
