import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import GameRoom from "./GameRoom";

import dixitLogo from "./media/dixit-logo.png";
import "./styles/app.css";

function App() {
    const [userInfo, setUserInfo] = useState({
        username: "",
        code: "",
    });

    const [isReady, setReady] = useState(false);

    const handleCodeChange = ({ target }) => {
        if (target.value >= 0 && target.value < 10000)
            setUserInfo({ ...userInfo, code: target.value });
    };

    const { username, code } = userInfo;

    const handleStart = () => {
        if (username.trim() !== "" && code > 999) {
            setReady(true);
        }
    };

    if (isReady) {
        return <GameRoom setReady={setReady} username={username} code={code} />;
    }

    return (
        <main className="home flex center column text-center">
            <img src={dixitLogo} style={{ maxWidth: 325 }} />
            <label htmlFor="username"> Insira seu nome: </label>
            <input
                onChange={(e) =>
                    setUserInfo({ ...userInfo, username: e.target.value })
                }
                value={username}
                id="username"
                type="text"
                className="box-input text-center"
                placeholder="Insira o nome"
                style={{ maxWidth: "90vw", minWidth: "15vw" }}
            />
            <label htmlFor="code"> Insira o código da sala: </label>
            <input
                value={code}
                onChange={handleCodeChange}
                id="code"
                type="number"
                className="box-input text-center"
                placeholder="_ _ _ _"
                style={{ maxWidth: "90vw", minWidth: "15vw" }}
            />
            {username.length && code > 199 ? (
                <input
                    type="submit"
                    className="box-input"
                    value="Entrar / Criar"
                    style={{ cursor: "pointer" }}
                    onClick={handleStart}
                />
            ) : (
                <input
                    disabled={true}
                    type="submit"
                    className="box-input"
                    style={{ opacity: "0.7" }}
                    value="Entrar / Criar"
                />
            )}
            <footer>
                <p> Criado por Wendell de Sousa | 2020</p>
            </footer>
        </main>
    );
}

export default App;
