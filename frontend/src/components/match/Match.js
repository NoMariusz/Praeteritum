import React, { useState, useEffect } from "react";

import { MATCH_CONNECTION_STATUSES } from "./constants";
import MatchLoading from "./MatchLoading";
import MatchConnectError from "./MatchConnectError";
import MatchGame from "./MatchGame";
import ChangeOrientationInfo from "./ChangeOrientationInfo";

export const Match = (props) => {
    /* main match component managing connection with socket and checking
    screen orientation to render proper Match parts */

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
        // check which websocket protocol should use
        const  ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
        
        setMatchSocket(
            new WebSocket(`${ws_scheme}://${window.location.host}/match-api/${matchId}/`)
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

    const renderGame = () => {
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
            return renderGame();
        case MATCH_CONNECTION_STATUSES.canNotConnect:
            return <MatchConnectError />;
        default:
            return <MatchLoading />;
    }
};

export default Match;
