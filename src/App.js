import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./components/Home";
import GameRoom from "./GameRoom";

import "./styles/app.css";

function App() {
    return (
        <BrowserRouter>
            <AnimatePresence exitBeforeEnter>
                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                    <Route path="/:roomid">
                        <GameRoom />
                    </Route>
                </Switch>
            </AnimatePresence>
        </BrowserRouter>
    );
}

export default App;
