import React, { useState, useEffect } from "react";
import { Snackbar } from "@material-ui/core";
import { getCSRF, sleep } from "components/../utils";
import RunningMatchInfo from "./RunningMatchInfo";

export const RunningMatchesNotifer = ({ goToMatchCallback }) => {
    /* displaying information about running matches */

    const [runningMatches, setRunningMatches] = useState([]);

    // searching for running matches to player

    let live = true;

    const startSearching = async () => {
        while (live) {
            searchForMatches();
            await sleep(5000);
        }
    };

    const searchForMatches = () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRF(),
            },
        };
        fetch("/match-api/active-matches", requestOptions).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    setRunningMatches(data.active_matches);
                });
            } else {
                console.error("Can not get runningMAtches information");
            }
        });
    };

    // start loop searching for running matches

    useEffect(() => {
        startSearching();
    }, []);

    // rendering

    return runningMatches.map((runningMatch) => (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={true}
            onClose={null}
            message="You have running Match"
        >
            <RunningMatchInfo
                matchInfo={runningMatch}
                goToMatchCallback={goToMatchCallback}
            />
        </Snackbar>
    ));
};

export default RunningMatchesNotifer;
