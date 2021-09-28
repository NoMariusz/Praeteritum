import React, { useState, useMemo, useEffect } from "react";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
    createMuiTheme as createTheme,
    ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { ToggleDarkModeContext } from "./darkModeContext";

export const DarkModeWrapper = ({ children }) => {
    /* Provides appropriate theme to children, which defines dark mode usage,
    and enable children to change mode */

    const preffersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    const [isDarkMode, setIsDarkMode] = useState(
        preffersDarkMode
    );

    useEffect(() => {
        setIsDarkMode(preffersDarkMode)
    }, [preffersDarkMode])

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    type: isDarkMode ? "dark" : "light",
                },
            }),
        [isDarkMode]
    );

    const toggleDarkMode = useMemo(() => () => {
        setIsDarkMode((value) => !value);
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToggleDarkModeContext.Provider value={toggleDarkMode}>
                {children}
            </ToggleDarkModeContext.Provider>
        </ThemeProvider>
    );
};

export default DarkModeWrapper;
