import React, { useEffect, useState } from "react";

import { usePrevious } from "src/utils.js";
import HpLightChange from "./HpLightAnim";
import HpStandardAnim from "./HpAstandardAnim";
import HpHeavyAnim from "./HpHeavyAnim";

export const UnitMatchAnimations = ({ unitData, children }) => {
    /* Wrapper watching at unitData and playing animations in response of data
    change */

    const prevUnitData = usePrevious(unitData);
    const [hpLightToggle, setHpLightToggle] = useState(false);
    const [hpStandardToggle, setHpStandardToggle] = useState(false);
    const [hpHeavyToggle, setHpHeavyToggle] = useState(false);

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
        // decide which anim play
        if (hpChange < 0 && hpChange > -5) {
            setHpLightToggle(true);
        } else if (hpChange <= -5 && hpChange >= -10) {
            setHpStandardToggle(true);
        } else if (hpChange < -10) {
            setHpHeavyToggle(true);
        }
    };

    return (
        <HpLightChange show={hpLightToggle} setShow={setHpLightToggle}>
            <HpStandardAnim
                show={hpStandardToggle}
                setShow={setHpStandardToggle}
            >
                <HpHeavyAnim show={hpHeavyToggle} setShow={setHpHeavyToggle}>
                    <>{children}</>
                </HpHeavyAnim>
            </HpStandardAnim>
        </HpLightChange>
    );
};

export default UnitMatchAnimations;
