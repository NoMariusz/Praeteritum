import React from "react";
import { Box, Typography } from "@material-ui/core";
import { BOARD_COLUMNS, BOARD_ROWS } from "./constants.js";

export const Field = ({fieldData}) => {
    return (
        <Box
            width={1/BOARD_COLUMNS}
            height={1/BOARD_ROWS}
            bgcolor={fieldData.is_base ? "#CCCCCC" : ""}
            color="text.primary"
            border={1}
            borderColor="text.primary"
        >
            {/* <Typography variant="body1" align="center">{fieldData.id_}</Typography> */}
        </Box>
    );
};

export default Field;
