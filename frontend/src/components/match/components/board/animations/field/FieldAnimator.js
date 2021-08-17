import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";

import { usePrevious } from "src/utils.js";
import AnimationPlayer from "../AnimationPlayer";
import { FIELD_ANIMS, FIELD_ANIMS_STYLES } from "./FieldAnimsData";
import StatAnimation from "../statistic_animation/StatAnimation";
import StatAnimManager from "../statistic_animation/StatAnimManager";

export const FieldAnimator = ({ unitData, units, children }) => {
    /* Wrapper watching at unitData, units and playing animations in response of data
    change */

    const prevUnitData = usePrevious(unitData);
    const [actualAnim, setActualAnim] = useState(null);

    const [statAnimMgr] = useState(() => new StatAnimManager());

    useEffect(() => {
        // play animations in result of state changes
        if (prevUnitData) {
            // play anims only if prev state is loaded
            playUnitChangeAnims();
        }
    }, [unitData]);

    const playUnitChangeAnims = () => {
        // check if unit dissapear from field
        if (prevUnitData != unitData && unitData == null) {
            const prevUnitNow = units.find(
                (unit) => unit.id == prevUnitData.id
            );

            // check if unit die or went to other field
            if (prevUnitNow.is_live) {
                setActualAnim(FIELD_ANIMS.went.name);
            } else {
                setActualAnim(FIELD_ANIMS.death.name);

                // play hp change animation
                const hpChange = prevUnitNow.hp - prevUnitData.hp;
                statAnimMgr.playAnim({
                    attributeName: "hp",
                    value: hpChange,
                });
            }
        }
    };

    return (
        <Box width={1} height={1} position="relative">
            <AnimationPlayer
                animName={actualAnim}
                animState={actualAnim}
                setAnimState={setActualAnim}
                animationsData={FIELD_ANIMS}
                animationsStylesData={FIELD_ANIMS_STYLES}
            >
                <>{children}</>
            </AnimationPlayer>
            <StatAnimation statAnimManager={statAnimMgr} />
        </Box>
    );
};

export default FieldAnimator;
