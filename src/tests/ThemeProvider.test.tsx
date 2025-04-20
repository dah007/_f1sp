import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "../components/ThemeProvider";
import { useState } from "react";
import { vi } from "vitest";
import "@testing-library/jest-dom";

describe("ThemeProvider", () => {
    beforeEach(() => {
        vi.mock("window.matchMedia", () => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("renders children correctly", () => {
        render(
            <ThemeProvider defaultTheme="light">
                <div data-testid="child">Child</div>
            </ThemeProvider>,
        );
        expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("applies default theme correctly", () => {
        render(
            <ThemeProvider defaultTheme="light">
                <div data-testid="child">Child</div>
            </ThemeProvider>,
        );
        const root = document.documentElement;
        expect(root.classList.contains("light")).toBe(true);
    });

    it("changes theme correctly", async () => {
        const TestComponent = () => {
            const [theme, setTheme] = useState("light");

            const toggleTheme = () => {
                const newTheme = theme === "light" ? "dark" : "light";
                setTheme(newTheme);
            };
            return (
                <div>
                    <span data-testid="theme">{theme}</span>
                    <button data-testid="setThemeButton" onClick={toggleTheme}>
                        Toggle Theme
                    </button>
                </div>
            );
        };

        render(
            <ThemeProvider defaultTheme="light">
                <TestComponent />
            </ThemeProvider>,
        );

        const button = screen.getByTestId("setThemeButton");
        await waitFor(() => button.click());

        expect(screen.getByTestId("theme").textContent).toBe("dark");
    });
});
