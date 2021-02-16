import React from "react";
import { Typography } from "@material-ui/core";
import CardParam from "./CardParam.js";

export const TypeParam = ({ value }) => {
    return (
        <CardParam color="gray">
            <Typography variant="h6">
                {value}
            </Typography>
    </CardParam>
    );
};

export default TypeParam ;
