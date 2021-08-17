import React from "react";
import { Portal, MenuItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { ZoomIn, ZoomOut } from "@material-ui/icons";

const SIZES = [10, 20, 40];

export const SizeChanger = ({ size, setSize, menuContainer }) => {
    /* Allows to change size state from parent */

    const changeSize = (offset) => {
        /* Change size value to other value from SIZES array depending on
        given offset */
        const index = SIZES.indexOf(size) + offset
        if (index < 0 || index >= SIZES.length){
            return false
        }

        setSize(SIZES[index])
        return true
    }

    return (
        <Portal container={menuContainer.current}>
            <MenuItem onClick={() => {changeSize(1)}}>
                <ListItemIcon>
                    <ZoomIn/>
                </ListItemIcon>
                <ListItemText>Zoom in board</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {changeSize(-1)}}>
                <ListItemIcon>
                    <ZoomOut/>
                </ListItemIcon>
                <ListItemText>Zoom out board</ListItemText>
            </MenuItem>
        </Portal>
    );
};

export default SizeChanger;
