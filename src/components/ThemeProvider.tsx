import { createContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'system',
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * ThemeProvider component that manages and provides the theme context to its children.
 *
 * @param {React.ReactNode} children - The child components that will have access to the theme context.
 * @param {string} [defaultTheme="system"] - The default theme to use if no theme is found in localStorage.
 * @param {string} [storageKey="shadcn-ui-theme"] - The key used to store the theme in localStorage.
 * @param {ThemeProviderProps} props - Additional props to be passed to the ThemeProviderContext.Provider.
 *
 * @returns {JSX.Element} The ThemeProvider component with the theme context.
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="light">
 *   <App />
 * </ThemeProvider>
 * ```
 */
const ThemeProvider = ({
    children,
    defaultTheme = 'system',
    storageKey = 'shadcn-ui-theme',
    ...props
}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
            return;
        }
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (newTheme: Theme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
};

/**
 * Custom hook to access the theme context.
 *
 * @returns {ThemeContextType} The current theme context value.
 * @throws {Error} If the hook is used outside of a ThemeProvider.
 *
 * @deprecated
 * @example
 * const theme = useTheme();
 * console.log(theme);
 */
// const useTheme = (): ThemeProviderState => {
//     const context = useContext(ThemeProviderContext);
//     console.log("context", context);
//     if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
//     return context;
// };

export { ThemeProvider /*, useTheme*/ };
