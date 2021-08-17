import React, { useState } from "react";
import {
    Button,
    Portal,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    DialogTitle,
} from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";

export const SurrenderOption = ({ matchSocket, menuContainer }) => {
    /* Component adding surrender option to OptionsMenu and handling all things
    like dialog to make sure if player want to surrender */

    const [openDialog, setOpenDialog] = useState(false);

    const showDialog = () => {
        setOpenDialog(true);
    };

    const closeDialog = () => {
        setOpenDialog(false);
    };

    const handleSurrender = () => {
        matchSocket.send(
            JSON.stringify({
                message: "surrender",
            })
        );

        setOpenDialog(false);
    };

    return (
        <>
            <Portal container={menuContainer.current}>
                <MenuItem onClick={showDialog}>
                    <ListItemIcon>
                        <FlagIcon />
                    </ListItemIcon>
                    <ListItemText>Surrender</ListItemText>
                </MenuItem>
            </Portal>
            <Dialog
                open={openDialog}
                onClose={closeDialog}
                aria-labelledby="surrender-dialog-title"
                aria-describedby="surrender-dialog-description"
            >
                <DialogTitle id="surrender-dialog-title">
                    Are you sure to surrender?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="surrender-dialog-description">
                        If you surrender, you end and lose this game immediately
                        and return to menu.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary" autoFocus>
                        No
                    </Button>
                    <Button onClick={handleSurrender} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SurrenderOption;
