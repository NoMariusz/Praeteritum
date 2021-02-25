import React, { useState, useEffect } from "react";

import { MATCH_CONNECTION_STATUSES } from "./constants.js";
import MatchLoading from "./MatchLoading.js";
import MatchConnectError from "./MatchConnectError.js";
import MatchGame from "./MatchGame.js";
import ChangeOrientationInfo from "./ChangeOrientationInfol.js";

export const Match = (props) => {
    // sockets values
    let matchId = props.match.params.matchId;
    const [matchSocket, setMatchSocket] = useState(null);
    const [connectStatus, setConnectStatus] = useState(
        MATCH_CONNECTION_STATUSES.connecting
    );

    // rendering values
    const [isLandscape, setIsLandscape] = useState(false);

    // rendering helpers

    const checkScreenOrientation = () => {
        let isLanscapeMediaMatch = window.matchMedia("(orientation: landscape)")
            .matches;
        setIsLandscape(isLanscapeMediaMatch);
    };

    // socket connection

    if (matchSocket == null) {
        setMatchSocket(
            new WebSocket(`ws://${window.location.host}/match-api/${matchId}/`)
        );
    } else {
        matchSocket.onopen = (e) => {
            console.info("Match socket opened");
            setConnectStatus(MATCH_CONNECTION_STATUSES.connected);
        };

        matchSocket.onclose = (e) => {
            console.warn("Match socket closed unexpectedly");
            setConnectStatus(MATCH_CONNECTION_STATUSES.canNotConnect);
        };
    }

    // page orientation

    useEffect(() => {
        window.addEventListener("resize", checkScreenOrientation);
        checkScreenOrientation();
    });

    // rendering

    const renderMatch = () => {
        return isLandscape ? (
            <MatchGame matchSocket={matchSocket} />
        ) : (
            <ChangeOrientationInfo />
        );
    };

    switch (connectStatus) {
        case MATCH_CONNECTION_STATUSES.connecting:
            return <MatchLoading />;
        case MATCH_CONNECTION_STATUSES.connected:
            return renderMatch();
        case MATCH_CONNECTION_STATUSES.canNotConnect:
            return <MatchConnectError />;
        default:
            return <MatchLoading />;
    }
};

export default Match;
