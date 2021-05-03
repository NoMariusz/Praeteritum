import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    List,
    ListSubheader,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
} from "@material-ui/core";
import {
    AccountCircle,
    Mail,
    Event as CallendarIcon,
} from "@material-ui/icons";

export const AccountBlock = () => {
    /* block displaying base information about user account */

    const [accountData, setAccountData] = useState({
        username: "",
        email: "",
        date_joined: "",
    });

    const loadAccountData = async () => {
        /* load from server informations about account */

        const res = await fetch("/player-data/account-short");
        if (!res.ok) {
            return false;
        }
        const answer = await res.json();
        setAccountData(answer.data);
    };

    useEffect(() => {
        loadAccountData();
    }, []);

    return (
        <Box maxWidth="30rem">
            <Paper elevation={1}>
                <Box p={1}>
                    <List
                        subheader={
                            <ListSubheader>Account information</ListSubheader>
                        }
                    >
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <AccountCircle />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                style={{ wordWrap: "break-word" }}
                                primary="Login"
                                secondary={accountData.username}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <Mail />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                style={{ wordWrap: "break-word" }}
                                primary="Email"
                                secondary={accountData.email}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <CallendarIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                style={{ wordWrap: "break-word" }}
                                primary="Date joined"
                                secondary={accountData.date_joined}
                            />
                        </ListItem>
                    </List>
                </Box>
            </Paper>
        </Box>
    );
};

export default AccountBlock;
