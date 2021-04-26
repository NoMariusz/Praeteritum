import React from "react";
import { Box } from "@material-ui/core";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import MenuNavBar from "./MenuNavBar";
import SearchMatchBlock from "./SearchMatchBlock";
import RunningMatchesNotifer from "./matches_notifer/RunningMatchesNotifer";

export const MenuPage = () => {
    /* provide player to manage game-related data, and make actions specific
    only for logged users */

    let { path } = useRouteMatch();

    return (
        <Box>
            <MenuNavBar />
            <Box m={3}>
                <Switch>
                    <Route
                        path={`${path}/search`}
                        component={SearchMatchBlock}
                    />
                    <Route exact path={`${path}/`} />
                </Switch>
            </Box>
            <RunningMatchesNotifer />
        </Box>
    );
};

export default MenuPage;
