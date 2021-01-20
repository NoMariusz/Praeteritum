import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import RegisterPage from "./authentication/RegisterPage";
import HomePage from "./home/HomePage";
import Game from "./match/Game";


const App = () => {
    return <BrowserRouter>
        <Switch>
            <Route path="/login" component={LoginPage}/>
            <Route path="/register" component={RegisterPage}/>
            <Route path="/game/:matchId" component={Game}/>
            <Route path="/" component={HomePage}/>
        </Switch>
    </BrowserRouter>
}


const appdiv = document.getElementById('app')
render(<App/>, appdiv)