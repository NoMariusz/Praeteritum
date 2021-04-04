import React from "react";
import MatchesSnackbarsRenderer from "./MatchesSnackbarsRenderer";
import { SnackbarProvider } from "notistack";

export const RunningMatchesNotifer = ({ goToMatchCallback }) => {
    /* display information about running matches */

    return (
        <SnackbarProvider
            maxSnack="3"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={null}
        >
            <MatchesSnackbarsRenderer goToMatchCallback={goToMatchCallback} />
        </SnackbarProvider>
    );
};

export default RunningMatchesNotifer;
