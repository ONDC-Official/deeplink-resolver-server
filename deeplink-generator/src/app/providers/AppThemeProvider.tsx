"use client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { createContext, useMemo, useState, useEffect } from "react";
import { darkTheme, lightTheme } from "../assets/themes";

type AppThemeContextType = {
	toggleTheme: () => void;
	mode: "light" | "dark";
};
export const AppThemeContext = createContext<AppThemeContextType>({} as AppThemeContextType);

export const AppThemeProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [mode, setMode] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const savedMode = localStorage.getItem('theme-mode') as "light" | "dark";
		if (savedMode) {
			setMode(savedMode);
		}
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		const newMode = mode === "light" ? "dark" : "light";
		setMode(newMode);
		localStorage.setItem('theme-mode', newMode);
	};

	const themeContextValue = useMemo(
		() => ({
			toggleTheme,
			mode,
		}),
		[mode]
	);

	if (!mounted) {
		return <>{children}</>;
	}

	return (
		<AppThemeContext.Provider value={themeContextValue}>
			<ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</AppThemeContext.Provider>
	);
};
