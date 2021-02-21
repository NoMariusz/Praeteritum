import React from "react";
import { Box, Typography } from "@material-ui/core";

export const Unit = ({ unitData }) => {
    return (
        <Typography variant="body1">Unit {unitData.id}</Typography>
    );
};

export default Unit;
