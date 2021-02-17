import React from "react";
import { Typography, Tooltip } from "@material-ui/core";
import CardParam from "./CardParam.js";

export const AttackParam = ({ value }) => {
    return (
        <CardParam color="error.main">
            <Tooltip title="Card attack">
                <Typography variant="h5" p="1">
                    {value}
                </Typography>
            </Tooltip>
        </CardParam>
    );
};

export default AttackParam;
