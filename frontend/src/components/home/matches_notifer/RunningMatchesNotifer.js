import React from "react";
import MatchesSnackbarsRenderer from "./MatchesSnackbarsRenderer";
import { SnackbarProvider } from "notistack";

export const RunningMatchesNotifer = () => {
    /* display information about running matches */

    return (
        <SnackbarProvider
            maxSnack="3"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={null}
        >
            <MatchesSnackbarsRenderer />
        </SnackbarProvider>
    );
};

export default RunningMatchesNotifer;
