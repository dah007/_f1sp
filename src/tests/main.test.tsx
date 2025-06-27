import { ThemeProviderProps } from '@/components/ui/theme-provider.tsx';
import * as ReactDOM from 'react-dom/client';
import * as ReactGA from 'react-ga4';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-dom/client', () => ({
    createRoot: vi.fn(() => ({ render: vi.fn() })),
}));
vi.mock('react-ga4', () => ({
    initialize: vi.fn(),
    default: {
        initialize: vi.fn(),
    },
}));
vi.mock('../app/store.ts', () => ({ store: {} }));
vi.mock('../components/ui/theme-provider.tsx', () => ({
    ThemeProvider: ({ children }: ThemeProviderProps) => children,
}));
vi.mock('../App.tsx', () => ({ default: () => 'App' }));

// Set up a fake root element in the document
beforeEach(() => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
});
afterEach(() => {
    const root = document.getElementById('root');
    if (root) root.remove();
    vi.clearAllMocks();
});

describe('main.tsx', async () => {
    it('initializes Google Analytics and renders the app', async () => {
        // Set up env var
        (import.meta as unknown as { env: Record<string, string> }).env = { VITE_GA_MEASUREMENT_ID: 'G-BKX0YT6DY2' };
        // Import after mocks
        await import('../main.tsx');
        expect(ReactGA.default.initialize).toHaveBeenCalledWith('G-BKX0YT6DY2');
        expect(ReactDOM.createRoot).toHaveBeenCalled();
        const root = document.getElementById('root');
        expect(root).not.toBeNull();
        // Check render was called
        // @ts-expect-error for some reason TS doesn't recognize the vi type
        const createRootMock = ReactDOM.createRoot as unknown as vi.Mock;
        const createRootResult = createRootMock.mock.results[0].value;
        expect(createRootResult.render).toHaveBeenCalled();
    });
});
