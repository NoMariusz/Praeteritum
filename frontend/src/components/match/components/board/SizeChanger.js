import React from "react";
import { Box, Typography, Slider, Paper } from "@material-ui/core";

export const SizeChanger = ({ size, setSize }) => {
    /* Enable to change size state from parent */

    const onSliderValueChange = (event, value) => {
        setSize(value);
    };

    const marks = [
        {
          value: 10,
          label: 'xs',
        },
        {
          value: 20,
          label: 's',
        },
        {
          value: 40,
          label: 'm',
        }
      ];

    return (
        <Box
            position="fixed"
            right="0"
            bottom="0"
            z-index="2"
            width="10%"
            px={1}
        >
            <Paper elevation={1}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    m={1}
                >
                    <Typography id="discrete-slider" gutterBottom variant="h6">
                        Board size
                    </Typography>
                    <Slider
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        marks={marks}
                        step={null}
                        defaultValue={size}
                        min={10}
                        max={40}
                        onChange={onSliderValueChange}
                        getAriaValueText={(v) => v + "rem"}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default SizeChanger;
