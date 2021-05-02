import React from "react";
import {
    Box,
    Container,
    Paper,
    Typography,
    Chip,
    Divider,
    Grid,
} from "@material-ui/core";
import SearchingDisplayer from "./SearchingDisplayer";
import FlashOnIcon from "@material-ui/icons/FlashOn";

export const SearchMatchSection = () => {
    /* section enabling to users search for matches */

    return (
        <Container maxWidth="md">
            <Paper elevation={1}>
                <Box
                    p={1}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    maxWidth="20rem"
                    mx="auto"
                >
                    <Box display={{ xs: "none", sm: "block" }}>
                        <FlashOnIcon style={{ fontSize: 50 }} color="primary" />
                    </Box>
                    <Box pb={1} display="flex">
                        <Typography variant="h4" align="center">
                            Quick game
                        </Typography>
                    </Box>
                    <Grid container>
                        <Grid align="center" xs item>
                            <Chip color="secondary" label="1v1" size="small" />
                        </Grid>
                        <Grid align="center" xs item>
                            <Chip color="secondary" label="PvP" size="small" />
                        </Grid>
                        <Grid align="center" xs item>
                            <Chip
                                color="secondary"
                                label="Normal"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                    <Box py={1} width={1}>
                        <Divider variant="middle" />
                    </Box>
                    <Typography align="center">
                        Battle against other random player at standard board
                        with your deck cards
                    </Typography>
                    <SearchingDisplayer />
                </Box>
            </Paper>
        </Container>
    );
};

export default SearchMatchSection;
