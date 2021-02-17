import React from "react";
import { Box } from "@material-ui/core";

export const CardParam = ({ color, children }) => {
    return (
        <Box
            bgcolor={color}
            color="primary.contrastText"
            p={0.5}
            border={1}
            borderRadius={8}
        >
            {children}
        </Box>
    );
};

export default CardParam;
