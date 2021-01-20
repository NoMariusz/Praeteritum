import React, { useState } from "react";
import { Button, Typography, Grid, Paper } from "@material-ui/core";
import { getCSRF } from "../../utlis";

export const SearchMatchPanel = ({goToMatchCallback}) => {
    const [isSearching, setIsSearching] = useState(false);

    const searchMatch = () => {
        setIsSearching(true);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRF(),
            },
        };
        fetch("/match/search", requestOptions)
            .then((res) => {
                if (res.ok){
                    res.json().then(data => {
                        goToMatchCallback(data.match_id)
                    })
                } else {
                    setIsSearching(false);
                    console.log('search error')
                }
            })
    };

    const cancelSearch = () => {
        setIsSearching(false);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRF(),
            },
        };
        fetch("/match/cancel-search", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log(`cancel search: ${data}`);
            });
    };

    return (
        <Paper elevation={1}>
            <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item align="center">
                    {!isSearching ? (
                        <Typography variant="h4">Start now</Typography>
                    ) : (
                        <Typography variant="h4">Searching ...</Typography>
                    )}
                </Grid>
                <Grid item align="center">
                    {!isSearching ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {searchMatch()}}
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

export default SearchMatchPanel;
