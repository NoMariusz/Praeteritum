import React, { useState } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import SearchingButton from "./SearchingButton";

export const SearchingDisplayer = () => {
    /* display if app is searching for match or not */

    const [isSearching, setIsSearching] = useState(false);

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box p={1} visibility={isSearching ? "visible" : "hidden"}>
                <CircularProgress/>
            </Box>
            <SearchingButton isSearching={isSearching} setIsSearching={setIsSearching} />
        </Box>
    );
};

export default SearchingDisplayer;
