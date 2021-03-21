import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";

function Home() {
    const [userInfo, setUserInfo] = useState({
        username: "",
        code: "",
        willPlay: false,
    });

    const [isReady, setReady] = useState(false);

    useEffect(() => {
        setReady(false);
        setUserInfo((user) => ({ ...user, willPlay: false }));
    }, []);

    const handleCodeChange = ({ target }) => {
        if (target.value.length < 5)
            setUserInfo({ ...userInfo, code: target.value });
    };

    const { username, code, willPlay } = userInfo;

    const handleStart = (e) => {
        console.log(code.length === 4);
        if (username.trim() !== "" && code.length === 4) {
            e.target.disabled = true;
            setUserInfo((user) => ({ ...user, willPlay: true }));
            localStorage.setItem("code", userInfo.code);
            localStorage.setItem("username", userInfo.username);
            setTimeout(() => {
                setReady(true);
            }, 3000);
        }
    };

    if (isReady) {
        return <Redirect to={{ pathname: `/${userInfo.code}` }} />;
    }

    return (
        <main
            className={`home flex center column ${
                willPlay ? "unmounting" : ""
            }`}
        >
            <div className="flex center column text-center">
                <span className="title">Dixit</span>
                <label htmlFor="username"> Insira seu nome: </label>
                <input
                    onChange={(e) =>
                        setUserInfo({
                            ...userInfo,
                            username: e.target.value,
                        })
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
                    type="text"
                    className="box-input text-center"
                    placeholder="_ _ _ _"
                    style={{ maxWidth: "90vw", minWidth: "15vw" }}
                />

                <input
                    disabled={!username.length || code.length < 4}
                    type="submit"
                    className="box-input"
                    style={
                        username.length && code.length === 4
                            ? { cursor: "pointer" }
                            : { opacity: "0.7" }
                    }
                    value="Entrar / Criar"
                    onClick={handleStart}
                />
                <footer>
                    <p className="footer-content">
                        Criado por Wendell de Sousa | 2020
                    </p>
                </footer>
            </div>
        </main>
    );
}

export default Home;
