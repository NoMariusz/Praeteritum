import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import RegisterPage from "./authentication/RegisterPage";
import HomePage from "./home/HomePage";
import MenuPage from "./game_menu/MenuPage";
import Match from "./match/Match";


const App = () => {
    return <BrowserRouter>
        <Switch>
            <Route path="/login" component={LoginPage}/>
            <Route path="/register" component={RegisterPage}/>
            <Route path="/match/:matchId" component={Match}/>
            <Route path="/menu" component={MenuPage}/>
            <Route path="/" component={HomePage}/>
        </Switch>
    </BrowserRouter>
}


const appDiv = document.getElementById('app')
render(<App/>, appDiv)
