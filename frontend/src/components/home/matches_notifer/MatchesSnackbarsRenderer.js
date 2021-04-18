import React, { useEffect } from "react";
import { getCSRF, sleep } from "components/../utils";
import RunningMatchInfo from "./RunningMatchInfo";
import { useSnackbar } from "notistack";

export const MatchesSnackbarsRenderer = () => {
    /* render snackbars with information about running matches as stack */

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    let runningMatches = [];
    let live = true;

    // searching for running matches to player

    const startSearching = async () => {
        /* start loop searching for running matches */
        while (live) {
            searchForMatches();
            await sleep(5000);
        }
    };

    const searchForMatches = () => {
        /* get from server running matches */
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRF(),
            },
        };
        fetch("/match-api/active-matches", requestOptions).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    updateSnacks(data.active_matches);
                });
            }
        });
    };

    const updateSnacks = (newMatches) => {
        /* close or enqueue snackbars depending on how change running matches
        list */

        // make snacks for new matches
        newMatches.forEach((newMatch) => {
            const foundInActual =
                runningMatches.findIndex((m) => m.id == newMatch.id) != -1;
            if (foundInActual) {
                return false;
            }
            enqueueSnackbar("", {
                key: newMatch.id,
                content: (
                    <div>
                        <RunningMatchInfo matchInfo={newMatch} />
                    </div>
                ),
            });
        });

        // close snacks for ended matches
        runningMatches.forEach((runningMatch) => {
            const foundInNew =
                newMatches.findIndex((m) => m.id == runningMatch.id) != -1;
            if (foundInNew) {
                return false;
            }
            closeSnackbar(runningMatch.id);
        });

        // update running matches
        runningMatches = newMatches;
    };

    // to start loop searching for running matches only at first render
    useEffect(() => {
        startSearching();
    }, []);

    // rendering

    return <></>;
};

export default MatchesSnackbarsRenderer;
