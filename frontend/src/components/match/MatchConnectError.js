import React from "react";
import {
    Container,
    Grid,
    Box,
    Paper,
    Typography,
    List,
    ListItemText,
    Button,
    Divider,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

export const MatchConnectError = () => {
    return (
        <Container>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
            >
                <Paper>
                    <Box m={4}>
                        <Grid container spacing={2} justify={"space-between"}>
                            <Grid item>
                                <Typography
                                    variant="h5"
                                    align="left"
                                    color="error"
                                >
                                    Can't connect to match
                                </Typography>
                            </Grid>
                            <Grid item>
                                <ErrorIcon color="error" fontSize="large" />
                            </Grid>
                        </Grid>
                        <Typography variant="subtitle1">
                            Connection with matchSocked closed !
                        </Typography>
                        <Box my={2}>
                            <Divider variant="middle" />
                        </Box>
                        <List
                            dense={true}
                            subheader={
                                <Typography variant="subtitle1">
                                    Examples of reasons:
                                </Typography>
                            }
                        >
                            <ListItemText
                                primary="Problems with internet connection"
                                inset
                            />
                            <ListItemText
                                primary="The match with this id not exists"
                                inset
                            />
                            <ListItemText
                                primary="You are not authorized to join this match"
                                inset
                            />
                        </List>
                        <Button href="/" color="primary">
                            Go back
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default MatchConnectError;
