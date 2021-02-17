import React from "react";
import { Typography } from "@material-ui/core";
import CardParam from "./CardParam.js";

export const HpParam = ({ value }) => {
    return (
        <CardParam color="success.main">
            <Typography variant="h5" p="1">
                {value}
            </Typography>
        </CardParam>
    );
};

export default HpParam;
