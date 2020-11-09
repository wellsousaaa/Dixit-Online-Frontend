import React, { useState, useEffect, useRef } from "react";

import MyCards from "./components/MyCards";
import MainSection from "./components/MainSection";
import PlayersList from "./components/PlayersList";

import Modal from "./components/Modal";

import socketIOClient from "socket.io-client";
import "./styles/game.css";

const ENDPOINT = "https://dixitbackend.herokuapp.com/";

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
        const currentSocket = socketIOClient(ENDPOINT, {transports: ['websocket', 'polling', 'flashsocket']});
        setSocket(currentSocket);

        currentSocket.emit("connect-room", { ...props });

        currentSocket.on("force-disconnect", () => {
            window.alert("O jogo já começou nessa sala!");
            props.setReady(false);
        });

        currentSocket.on("update-players", (players) => {
            playersRef.current.updatePlayers(players);
        });

        currentSocket.on("auth-mod", (mod) => {
            setModerator(mod);
        });

        currentSocket.on("update-cards", (cards) => {
            setGameState("playing");
            cardsRef.current.updateCards(cards);
        });

        currentSocket.on("next-round", (playersPoints) => {
            modalRef.current.changePoints(playersPoints);
            setTimeout(() => {
                currentSocket.emit("can-proceed");
            }, 1000);

            gameRef.current.cleanEverything();
        });

        currentSocket.on("update-turn", (type, data) => {
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

        currentSocket.on("get-card", (cardNumber) => {
            cardsRef.current.addCard(cardNumber);
        });

        currentSocket.on("game-over", (winner) => {
            modalRef.current.setGameOver(winner);
            gameRef.current.cleanEverything();
            setGameState("waiting");
        });
        return () => {
            currentSocket.disconnect();
        };
    }, []);

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

    return (
        <div className="game-room flex">
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
    );
};

export default GameRoom;
