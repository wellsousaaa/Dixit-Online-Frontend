import React, { useState, useEffect, useRef } from "react";

import MyCards from "./components/MyCards";
import MainSection from "./components/MainSection";
import PlayersList from "./components/PlayersList";

import Modal from "./components/Modal";

import socketIOClient from "socket.io-client";
import "./styles/game.css";
import { Redirect } from "react-router-dom";

const ENDPOINT = process.env.REACT_APP_ENDPOINT;

const GameRoom = (props) => {
    const { username, code } = props;

    /// STATES
    const [moderator, setModerator] = useState(false);
    const [gameState, setGameState] = useState("waiting");
    const [socket, setSocket] = useState(null);
    const [canSend, setCanSend] = useState(false);
    const [points, setPoints] = useState([]);

    /// REFS
    const cardsRef = useRef();
    const playersRef = useRef();
    const gameRef = useRef();
    const modalRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentSocket = socketIOClient(ENDPOINT);
                setSocket(currentSocket);
            } catch (err) {
                setSocket(false);
            }
        };

        if (localStorage.getItem("code") && localStorage.getItem("username"))
            fetchData();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit("connect-room", {
                code: localStorage.getItem("code"),
                username: localStorage.getItem("username"),
            });

            socket.on("force-disconnect", () => {
                window.alert("O jogo já começou nessa sala!");
                props.setReady(false);
            });

            socket.on("update-players", (players) => {
                playersRef.current.updatePlayers(players);
            });

            socket.on("auth-mod", (mod) => {
                setModerator(mod);
            });

            socket.on("update-cards", (cards) => {
                setGameState("playing");
                cardsRef.current.updateCards(cards);
            });

            socket.on("next-round", (playersPoints) => {
                modalRef.current.changePoints(playersPoints);
                setTimeout(() => {
                    socket.emit("can-proceed");
                }, 1000);

                gameRef.current.cleanEverything();
            });

            socket.on("update-turn", (type, data) => {
                if (type === 1) {
                    gameRef.current.changeFortuneTeller(data);
                } else if (type === 1.5) {
                    gameRef.current.myTurn(data);
                } else if (type === 2) {
                    setCanSend(true);
                    gameRef.current.changeMessage(data);
                } else if (type === 3) {
                    setCanSend(false);
                    gameRef.current.showCards(data);
                } else if (type === 4) {
                    gameRef.current.showVotes(data);
                }
            });

            socket.on("get-card", (cardNumber) => {
                cardsRef.current.addCard(cardNumber);
            });

            socket.on("game-over", (winner) => {
                modalRef.current.setGameOver(winner);
                gameRef.current.cleanEverything();
                setGameState("waiting");
            });
            return () => {
                socket.disconnect();
            };
        }
    }, [socket]);

    function startGame() {
        socket.emit("start-game");
    }

    function sendDescription(desc) {
        socket.emit("send-description", desc);
    }

    function voteCard(number) {
        socket.emit("vote-card", number);
    }

    function nextTurn() {
        socket.emit("next-turn");
    }

    const handleCardSubmit = (index) => {
        if (!canSend) return;

        socket.emit("send-card", index);
        setCanSend(false);
        cardsRef.current.removeCard(index);
    };

    if (!(localStorage.getItem("code") && localStorage.getItem("username")))
        return <Redirect to="/" />;

    return (
        <div className="game-room mounting flex">
            {socket ? (
                <div className="game-container flex">
                    <Modal ref={modalRef} points={points} />
                    <MyCards
                        ref={cardsRef}
                        gameState={gameState}
                        handleCardSubmit={handleCardSubmit}
                        canSend={canSend}
                    />

                    <MainSection
                        ref={gameRef}
                        moderator={moderator}
                        gameState={gameState}
                        startGame={startGame}
                        sendDescription={sendDescription}
                        voteCard={voteCard}
                        nextTurn={nextTurn}
                    />

                    <PlayersList ref={playersRef} />
                </div>
            ) : (
                <h1>AAAAAAAAAAAAA</h1>
            )}
        </div>
    );
};

export default GameRoom;
