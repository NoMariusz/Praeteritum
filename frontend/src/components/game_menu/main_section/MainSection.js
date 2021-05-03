import React from "react";
import { Container, Grid } from "@material-ui/core";

import HelloBlock from "./HellloBlock";
import AccountBlock from "./AccountBlock";
import PlayBlock from "./PlayBlock";

export const MainSection = () => {
    /* section showing samples of options in menu and enable to navigate to
    them and displaying other sample ovarall data */

    return (
        <Container maxWidth="md">
            <Grid spacing={1} container>
                <Grid item xs={12} align="center">
                    <HelloBlock />
                </Grid>
                <Grid item xs align="center">
                    <AccountBlock />
                </Grid>
                <Grid item xs={12} align="center">
                    <PlayBlock />
                </Grid>
            </Grid>
        </Container>
    );
};

export default MainSection;
