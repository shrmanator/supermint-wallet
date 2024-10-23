"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

/**
 * ThemeProvider component
 *
 * This component wraps the application with the NextThemesProvider to manage and apply themes.
 * It provides support for light, dark, and system themes, allowing the user to toggle between them.
 * @param {ThemeProviderProps} props - The props are forwarded to NextThemesProvider to customize the theme behavior.
 * @returns {JSX.Element} The themed wrapper for the app.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
