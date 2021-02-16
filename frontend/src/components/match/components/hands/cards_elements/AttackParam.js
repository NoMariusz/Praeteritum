import React from "react";
import { Typography } from "@material-ui/core";
import CardParam from "./CardParam.js";

export const AttackParam = ({ value }) => {
    return (
        <CardParam color="red">
            <Typography variant="h5" p="1">
                {value}
            </Typography>
    </CardParam>
    );
};

export default AttackParam ;
