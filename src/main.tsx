import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga4';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { store } from './app/store.ts';
import { ThemeProvider } from './components/ui/theme-provider.tsx';
import './main.css';

const gMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

ReactGA.initialize(gMeasurementId);

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
