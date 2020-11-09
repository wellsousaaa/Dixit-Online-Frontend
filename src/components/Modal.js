import React, { useState, useImperativeHandle, forwardRef } from "react";
import "../styles/modal.css";

const Modal = forwardRef((props, ref) => {
    /// STATES
    const [points, setPoints] = useState([]);
    const [winner, setWinner] = useState(null);
    const [modalVisibility, setModalVisibility] = useState("no-visibility");

    useImperativeHandle(ref, () => ({
        changePoints(playerPoints) {
            setPoints(playerPoints);
            setModalVisibility("");
        },
        setGameOver(winner) {
            setWinner(winner);
            setModalVisibility("");
        },
    }));

    const closeModal = () => {
        setTimeout(() => {
            setPoints([]);
            setWinner(null);
        }, 500);
        setModalVisibility("no-visibility");
    };

    if (winner)
        return (
            <div class={`modal ${modalVisibility}`}>
                <div class="modal-content">
                    <h1>
                        <span className="emoji">🎉</span> Vencedor{" "}
                        <span className="emoji">🎉</span>
                    </h1>
                    <h2>{winner}</h2>
                    <p style={{ marginLeft: "10 !important" }}>
                        Chegou a 30 pontos primeiro!{" "}
                    </p>
                    <ul></ul>
                    <button value="Fechar" onClick={closeModal}>
                        Fechar
                    </button>
                </div>
            </div>
        );

    return (
        <div class={`modal ${modalVisibility}`}>
            <div class="modal-content">
                <h1>
                    <span className="emoji">🔸</span> Pontuação{" "}
                    <span className="emoji">🔸</span>
                </h1>
                <p>Quem chegar com 30 pontos primeiro vencer! </p>
                <ul>
                    {points.map((p) => (
                        <li>
                            <span> {p.username}: </span> {p.points}
                        </li>
                    ))}
                </ul>
                <button value="Fechar" onClick={closeModal}>
                    Fechar
                </button>
            </div>
        </div>
    );
});

export default Modal;
