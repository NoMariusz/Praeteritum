import React from "react";
import { Box, Card } from "@material-ui/core";

export const CardParam = ({ color, children }) => {
    return (
        <Card variatn="outlined">
            <Box bgcolor={color} color="primary.contrastText" p={0.5}>
                {children}
            </Box>
        </Card>
    );
};

export default CardParam;
