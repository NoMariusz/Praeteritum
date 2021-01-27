import React, {useState} from "react";
import { Container, Grid, Box } from "@material-ui/core";

export const Game = (props) => {
    let matchId = props.match.params.matchId;
    const [players, setPlayers] = useState([]);
    const [matchSocket, setMatchSocket] = useState(null);

    if (matchSocket == null){
        setMatchSocket(
            new WebSocket(
                `ws://${window.location.host}/match/${matchId}/`
            )
        );
    } else {
        matchSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(`websocket onmessage: ${data.message}`);
            switch (data.message.name) {
                case 'players-list':
                    setPlayers(data.message.players);
                    break;
            }
        };

        matchSocket.onclose = (e) => {
            console.warn('Match socket closed unexpectedly');
        };

        matchSocket.onopen = (e) => {
            matchSocket.send(JSON.stringify({'message': 'get-players'}));
        };
    }

    return (
        <Container>
            <p>game: {matchId}</p>
            {players.map(player =>
                <p>player: {player}</p>
            )}
        </Container>
    );
};

export default Game;
