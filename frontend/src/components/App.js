import React from "react";
import { render } from "react-dom";

import Router from "./Router";
import DarkModeWrapper from "./dark_mode/DarkModeWrapper";

const App = () => {
    return (
        <DarkModeWrapper>
            <Router />
        </DarkModeWrapper>
    );
};

const appDiv = document.getElementById("app");
render(<App />, appDiv);
