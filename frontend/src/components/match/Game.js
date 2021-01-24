import React from "react";
import { Container, Grid, Box } from "@material-ui/core";

export const Game = (props) => {
    let matchId = props.match.params.matchId;

    const chatSocket = new WebSocket(
        `ws://${window.location.host}/match/${matchId}/`
    );

    chatSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(`websocket onmessage: ${data.message}`);
    };

    chatSocket.onclose = (e) => {
        console.warn('Match socket closed unexpectedly');
    };

    chatSocket.onopen = (e) => {
        chatSocket.send(JSON.stringify({'message': 'show'}))
        chatSocket.send(JSON.stringify({'message': 'initial_message'}))
    }


    return (
        <p>game: {matchId}</p>
    );
};

export default Game;
