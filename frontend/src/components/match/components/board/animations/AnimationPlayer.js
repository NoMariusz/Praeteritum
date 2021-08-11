import React from "react";
import { Box } from "@material-ui/core";

import { useClearState } from "src/utils";

export const AnimationPlayer = ({
    animState,
    setAnimState,
    animName,
    children,
    animationsData,
    animationsStylesData,
}) => {
    /* Wrapper playing animations controlled by state from parrent */

    // check if is anim to play
    if (animName == null) {
        return <>{children}</>;
    }

    const classes = animationsStylesData[animName]();

    // to clear state value after play animation
    useClearState(
        animState,
        setAnimState,
        animName,
        null,
        animationsData[animName].duration
    );

    return (
        <Box width={1} height={1} className={classes.animated}>
            {children}
        </Box>
    );
};

export default AnimationPlayer;
