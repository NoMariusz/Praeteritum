import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { getCSRF, sleep } from "../../../utils";

export const SearchMatchBlock = ({isSearching, setIsSearching}) => {
    /* component enabling to search for match and cancel searching */

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

        // made proper action depending on result status
        switch (res.status) {
            case 201:
                // when response ok go to match
                const data = await res.json();
                // redirect to match
                history.push(`/match/${data.match_id}`);
                break;

            case 404:
                // when problem with response set that is not searching
                setIsSearching(false);
                break;

            case 503:
                // when searching time out, retry searching
                await sleep(1500)
                searchMatch();
                break;

            default:
                break;
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

    return !isSearching ? (
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
                searchMatch();
            }}
        >
            Find match
        </Button>
    ) : (
        <Button variant="contained" color="secondary" onClick={cancelSearch}>
            Cancel finding
        </Button>
    );
};

export default SearchMatchBlock;
