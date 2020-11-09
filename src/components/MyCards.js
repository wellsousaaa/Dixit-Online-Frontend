import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useEffect,
    useRef,
} from "react";
import { getImage } from "../Functions";

import "../styles/card.css";

const MyCards = forwardRef((props, ref) => {
    const [Cards, setCards] = useState([]);

    useEffect(() => {}, [props.canSend]);

    useImperativeHandle(ref, () => ({
        updateCards(cardNumbers) {
            const newCards = getImage(cardNumbers);
            setCards(newCards);
        },
        removeCard(cardIndex) {
            const cards = Cards;
            const newCards = [];
            cards.forEach((card) => {
                if (card.number !== cardIndex) newCards.push(card);
            });
            setCards(newCards);
        },
        addCard(cardNumber) {
            let newCard = getImage(cardNumber);
            if (Array.isArray(newCard)) newCard = newCard[0];
            const actualCards = Cards.splice(0);
            actualCards.push(newCard);
            setCards(actualCards);
        },
    }));

    const asideRef = useRef();

    const openCards = () => {
        asideRef.current.style.display = "unset";
    };

    const closeCards = () => {
        asideRef.current.style.display = "none";
    };

    const { gameState, canSend, handleCardSubmit } = props;

    return (
        <>
            <div className="float" onClick={openCards}>
                <input
                    type="submit"
                    className="box-input"
                    value="Ver cartas"
                    style={{ cursor: "pointer", borderRadius: 10 }}
                />
            </div>
            <aside ref={asideRef}>
                <p
                    style={{
                        cursor: "pointer",
                        marginLeft: 10,
                        float: "left",
                        fontSize: 25,
                    }}
                    className="close"
                    onClick={closeCards}
                >
                    X
                </p>
                <h1> 🎴 Suas cartas </h1>
                <p> Toque no ícone superior esquerdo para enviar. </p>
                {gameState === "waiting" ? (
                    <h1>
                        <i> O jogo ainda não começou </i>
                    </h1>
                ) : (
                    <div className="flex center wrap">
                        {Cards === [] ? (
                            <h1>Você ainda não tem cartas</h1>
                        ) : (
                            Cards.map((item) => (
                                <div className="card-container up">
                                    <input
                                        type="submit"
                                        className={`card-input cansend-${canSend}`}
                                        value="→"
                                        key={item.number}
                                        onClick={(e) =>
                                            handleCardSubmit(item.number)
                                        }
                                        disabled={!canSend}
                                    />
                                    <img
                                        className="myCard"
                                        src={item.url}
                                        key={item.number}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </aside>
        </>
    );
});

export default MyCards;
