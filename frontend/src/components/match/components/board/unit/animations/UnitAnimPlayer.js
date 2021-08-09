import React from "react";
import { Box } from "@material-ui/core";

import { UNIT_ANIMS, UNIT_ANIMS_STYLES } from "./UnitAnimsData";
import { useClearState } from "src/utils";

export const UnitAnimPlayer = ({
    animState,
    setAnimState,
    animName,
    children,
}) => {
    /* Wrapper handling unit animations */

    // check if is anim to play
    if (animName == null) {
        return <>{children}</>;
    }

    const classes = UNIT_ANIMS_STYLES[animName]();

    // to clear state value after play animation
    useClearState(
        animState,
        setAnimState,
        animName,
        null,
        UNIT_ANIMS[animName].duration
    );

    return (
        <Box width={1} height={1} className={classes.animated}>
            {children}
        </Box>
    );
};

export default UnitAnimPlayer;
