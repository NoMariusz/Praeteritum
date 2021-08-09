import React, { useEffect, useState } from "react";

import { usePrevious } from "src/utils.js";
import UnitAnimPlayer from "./UnitAnimPlayer";
import { UNIT_ANIMS } from "./UnitAnimsData";

export const UnitMatchAnimations = ({ unitData, children }) => {
    /* Wrapper watching at unitData and playing animations in response of data
    change */

    const prevUnitData = usePrevious(unitData);
    const [actualAnim, setActualAnim] = useState(null);

    useEffect(() => {
        // play animations in result of state changes
        playHpChangeAnims();
    }, [unitData]);

    const playHpChangeAnims = () => {
        // play anims only if prev state is loaded
        if (!prevUnitData) {
            return false;
        }
        // calc hp change
        const hpChange = unitData.hp - prevUnitData.hp;
        if (hpChange == 0) {
            return false;
        }
        // decide which anim play
        if (hpChange < 0 && hpChange > -5) {
            setActualAnim(UNIT_ANIMS.hpLight.name);
        } else if (hpChange <= -5 && hpChange >= -10) {
            setActualAnim(UNIT_ANIMS.hpStandard.name);
        } else if (hpChange < -10) {
            setActualAnim(UNIT_ANIMS.hpHeavy.name);
        }

        return true;
    };

    return (
        <UnitAnimPlayer
            animName={actualAnim}
            animState={actualAnim}
            setAnimState={setActualAnim}
        >
            <>{children}</>
        </UnitAnimPlayer>
    );
};

export default UnitMatchAnimations;
