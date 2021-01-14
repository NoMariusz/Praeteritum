import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import RegisterPage from "./authentication/RegisterPage";
import HomePage from "./HomePage";


const App = () => {
    return <BrowserRouter>
        <Switch>
            <Route path="/login" component={LoginPage}/>
            <Route path="/register" component={RegisterPage}/>
            <Route path="/" component={HomePage}/>
        </Switch>
    </BrowserRouter>
}


const appdiv = document.getElementById('app')
render(<App/>, appdiv)
