import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useEffect,
    useRef,
} from "react";
import { getImage } from "./Functions";
import Card from "./Card";

import "../styles/card.css";

const MyCards = forwardRef((props, ref) => {
    const [Cards, setCards] = useState([]);

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
            <aside
                className="text-center"
                ref={asideRef}
                style={{ display: "none", maxWidth: 464 }}
            >
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
                <div className="flex center">
                    <img
                        className="card-icon"
                        src="https://static1.squarespace.com/static/5873ecfee6f2e1f142e09dce/597ae567d1758e9d840945a6/597ae596d482e9e56c9936f7/1501226394350/Playing_card_spade_A_thin.png"
                    />
                    <h1 style={{ padding: "0 15px" }}>Suas cartas</h1>
                    <img
                        className="card-icon"
                        src="https://static1.squarespace.com/static/5873ecfee6f2e1f142e09dce/597ae567d1758e9d840945a6/597ae596d482e9e56c9936f7/1501226394350/Playing_card_spade_A_thin.png"
                    />
                </div>
                <p> Toque no ícone superior esquerdo para enviar. </p>
                {gameState === false ? (
                    <h1></h1>
                ) : (
                    <div className="flex center wrap">
                        {Cards === [] ? (
                            <h1>Você ainda não tem cartas</h1>
                        ) : (
                            Cards.map((item) => (
                                <Card
                                    canSend={canSend}
                                    handleCardSubmit={handleCardSubmit}
                                    {...item}
                                />
                            ))
                        )}
                    </div>
                )}
            </aside>
        </>
    );
});

export default MyCards;
