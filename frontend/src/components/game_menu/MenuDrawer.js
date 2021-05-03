import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

export const MenuDrawer = () => {
    /* complex drawer enabling player to navigate between game menu options */

    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <IconButton
                aria-label="Open menu"
                edge="start"
                color="inherit"
                onClick={() => {
                    setDrawerOpen(true);
                }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                }}
            >
                <List>
                    <ListItem
                        button
                        component={Link}
                        to="/menu"
                        underline="none"
                    >
                        <ListItemText>Main menu page</ListItemText>
                    </ListItem>
                    <ListItem
                        button
                        component={Link}
                        to="/menu/search"
                        underline="none"
                    >
                        <ListItemText>Searching</ListItemText>
                    </ListItem>
                    <Divider/>
                    <ListItem
                        button
                        component={Link}
                        to="/"
                        underline="none"
                    >
                        <ListItemText>Go home</ListItemText>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default MenuDrawer;
