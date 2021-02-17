import React from "react";
import { Typography, Tooltip } from "@material-ui/core";
import CardParam from "./CardParam.js";

export const RarityParam = ({ value }) => {
    return (
        <CardParam color="text.secondary">
            <Tooltip title="Card rarity">
                <Typography variant="h6">{value}</Typography>
            </Tooltip>
        </CardParam>
    );
};

export default RarityParam;
