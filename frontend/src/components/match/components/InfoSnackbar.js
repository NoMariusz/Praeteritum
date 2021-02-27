import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

export const InfoSnackbar = ({
    snackbarVisible,
    snackbarMessage,
    closeSnackbar,
}) => (
    <Snackbar
        open={snackbarVisible}
        autoHideDuration={1500}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
        <MuiAlert onClose={closeSnackbar} severity="error">
            {snackbarMessage}
        </MuiAlert>
    </Snackbar>
);

export default InfoSnackbar;
