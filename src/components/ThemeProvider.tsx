"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type FontTheme = "lora" | "geist" | "retro" | "sci-fi";

interface ThemeContextType {
    fontTheme: FontTheme;
    setFontTheme: (theme: FontTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [fontTheme, setFontThemeState] = useState<FontTheme>("lora");

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("font-theme") as FontTheme;
        if (saved && ["lora", "geist", "retro", "sci-fi"].includes(saved)) {
            setFontThemeState(saved);
        }
    }, []);

    const setFontTheme = (theme: FontTheme) => {
        setFontThemeState(theme);
        localStorage.setItem("font-theme", theme);
    };

    // Apply font class to document
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("font-lora", "font-geist", "font-retro", "font-sci-fi");
        root.classList.add(`font-${fontTheme}`);
    }, [fontTheme]);

    // Handle Dark Mode based on system preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            if (mediaQuery.matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };

        // Initial check
        handleChange();

        // Listen for changes
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <ThemeContext.Provider value={{ fontTheme, setFontTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
