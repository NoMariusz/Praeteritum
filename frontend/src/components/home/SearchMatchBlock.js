import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Typography, Grid, Paper } from "@material-ui/core";
import { getCSRF } from "../../utils";

export const SearchMatchBlock = () => {
    /* component enabling to search for match and cancel searching */

    const [isSearching, setIsSearching] = useState(false);

    const history = useHistory();

    const searchMatch = async () => {
        /* send something like long pooling request starting searching
        and returning match id when found match */

        setIsSearching(true);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRF(),
            },
        };
        const res = await fetch("/match-api/search", requestOptions);

        if (res.ok) {
            // when response ok go to match
            const data = await res.json();
            // redirect to match
            history.push(`/match/${data.match_id}`);
        } else if (res.status != 404) {
            // when problem with response set that is not searching
            setIsSearching(false);
        }
    };

    const cancelSearch = async () => {
        /* cancel searching for match in server */

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRF(),
            },
        };
        await fetch("/match-api/cancel-search", requestOptions);
        setIsSearching(false);
    };

    const loadIsSearching = async () => {
        /* check if server is searching form match now, and update self status
        depending on result */

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRF(),
            },
        };
        const res = await fetch("/match-api/is-searching", requestOptions);
        const data = await res.json();
        // if user searching for match, restart searching
        if (data.result) {
            searchMatch();
        }
    };

    useEffect(() => {
        // at first rednder load if user searching for match
        loadIsSearching();
    }, []);

    return (
        <Paper elevation={1}>
            <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item align="center">
                    <Typography variant="h4">
                        {isSearching ? "Searching ..." : "Start now"}
                    </Typography>
                </Grid>
                <Grid item align="center">
                    {!isSearching ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                searchMatch();
                            }}
                        >
                            Search match
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={cancelSearch}
                        >
                            Cancel
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default SearchMatchBlock;
