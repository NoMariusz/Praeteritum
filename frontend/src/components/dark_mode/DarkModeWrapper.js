import React from "react";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
    createMuiTheme as createTheme,
    ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

export const DarkModeWrapper = ({ children }) => {
    /* Provides appropriate theme to children, which defines dark mode usage */

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    type: prefersDarkMode ? "dark" : "light",
                },
            }),
        [prefersDarkMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default DarkModeWrapper;
