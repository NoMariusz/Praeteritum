import React, { useContext } from "react";
import {
    Portal,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import { Brightness4, Brightness7 } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";

import { ToggleDarkModeContext } from "components/dark_mode/darkModeContext";

export const ChangeModeOption = ({ menuContainer }) => {
    const theme = useTheme();
    const toggleDarkMode = useContext(ToggleDarkModeContext);

    return (
        <Portal container={menuContainer.current}>
            <MenuItem onClick={toggleDarkMode}>
                <ListItemIcon>
                    {theme.palette.type === "dark" ? (
                        <Brightness4 />
                    ) : (
                        <Brightness7 />
                    )}
                </ListItemIcon>
                <ListItemText>Change mode</ListItemText>
            </MenuItem>
        </Portal>
    );
};

export default ChangeModeOption;
