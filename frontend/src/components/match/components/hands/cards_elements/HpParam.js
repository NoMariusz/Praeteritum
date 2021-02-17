import React from "react";
import { Typography, Tooltip } from "@material-ui/core";
import CardParam from "./CardParam.js";

export const HpParam = ({ value }) => {
    return (
        <CardParam color="success.main">
            <Tooltip title="Card health points">
                <Typography variant="h5" p="1">
                    {value}
                </Typography>
            </Tooltip>
        </CardParam>
    );
};

export default HpParam;
