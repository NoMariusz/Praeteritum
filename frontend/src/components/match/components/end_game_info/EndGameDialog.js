import React from "react";
import { Button, Dialog, DialogActions, Slide } from "@material-ui/core";

const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));

export const EndGameDialog = (props) => (
    <Dialog open={true} TransitionComponent={Transition}>
        {props.children}
        <DialogActions>
            <Button variant="outlined" color="primary" href="/">
                Continue
            </Button>
        </DialogActions>
    </Dialog>
);

export default EndGameDialog;
