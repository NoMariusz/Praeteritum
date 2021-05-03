import React from "react";
import { 
    Container, Box, Paper
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
    root: {
        backgroundImage: 'url("/static/images/AuthBackground.jpg")',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundRepeat: "no-repeat",
        border: 0,
        color: 'white',
        minHeight: '100vh',
    },
});


export const FormWrapper = (props) => {
    /* wrapper making container for app forms */

    const classes = useStyles();

    return <Box classes={{root: classes.root}}>
        <Box py={3}>
            <Container maxWidth="xs">
                <Paper variant="outlined" elevation={3}>
                    <Box p={1} m={1}>
                        {props.children}
                    </Box>
                </Paper>
            </Container>
        </Box>
    </Box>
}


export default FormWrapper;
