import { sleep } from "src/utils";
import { STAT_ANIM_DURATION } from "./constants";

export default class StatAnimManager {
    /* Simple animation manager enabling to prevent collision with playing
    many animations at that same time */

    constructor() {
        this.animsQueue = [];
        this.state = null;
        this.setState = null;
        this.prepared = false;
        // special additional control to show if actually playing animation
        this.locked = false;
    }

    subscribeState(state, setState) {
        /* subscribe component state to manager, now manager can run animations
        for that component */
        this.state = state;
        this.setState = setState;
        this.prepared = true;
    }

    playAnim(animationData) {
        /* Handle playing animation which can be queued to display all
        information after another */
        if (!this.prepared) {
            return false;
        }

        if (!this.locked) {
            this.locked = true;

            this.setState(animationData);
            this.startClearAnim();
        } else {
            this.animsQueue.push(animationData);
        }
        return true;
    }

    async startClearAnim() {
        /* clear state after playing animation */
        await sleep(STAT_ANIM_DURATION);

        this.setState(null);
        this.locked = false;

        this.tryPlayNextAnim();
    }

    tryPlayNextAnim() {
        /* play next anim if is in animsQueue */
        if (this.animsQueue.length <= 0) {
            return false;
        }

        const animData = this.animsQueue.shift();
        this.playAnim(animData);
        return true;
    }
}
