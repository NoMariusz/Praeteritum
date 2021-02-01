import React, {useState} from "react";
import { Container, Grid, Box } from "@material-ui/core";

import { MATCH_CONNECTION_STATUSES } from "../constants.js";
import MatchLoading from "./MatchLoading.js";
import MatchConnectError from "./MatchConnectError.js";

export const Match = (props) => {
    let matchId = props.match.params.matchId;
    const [players, setPlayers] = useState([]);
    const [matchSocket, setMatchSocket] = useState(null);
    const [connectStatus, setConnectStatus] = useState(MATCH_CONNECTION_STATUSES.connecting);

    if (matchSocket == null){
        setMatchSocket(
            new WebSocket(
                `ws://${window.location.host}/match/${matchId}/`
            )
        );
    } else {
        matchSocket.onopen = (e) => {
            matchSocket.send(JSON.stringify({'message': 'get-players'}));
            setConnectStatus(MATCH_CONNECTION_STATUSES.connected)
        };
    
        matchSocket.onclose = (e) => {
            console.warn('Match socket closed unexpectedly');
            setConnectStatus(MATCH_CONNECTION_STATUSES.canNotConnect)
        };

        matchSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(`websocket onmessage: ${data.message}`);
            switch (data.message.name) {
                case 'players-list':
                    setPlayers(data.message.players);
                    break;
            }
        };
    }

    const renderBaseGame = () => {
        return <Container>
            <p>game: {matchId}</p>
            {players.map(player =>
                <p>player: {player}</p>
            )}
        </Container>
    }

    switch (connectStatus) {
        case MATCH_CONNECTION_STATUSES.connecting:
            return <MatchLoading/>;
        case MATCH_CONNECTION_STATUSES.connected:
            return renderBaseGame();
        case MATCH_CONNECTION_STATUSES.canNotConnect:
            return <MatchConnectError/>;
        default:
            return <MatchLoading/>;
    }
};

export default Match;
