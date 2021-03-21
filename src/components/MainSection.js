import React, {
    useState,
    useImperativeHandle,
    forwardRef,
    useRef,
} from "react";
import { getImage } from "./Functions";

const MainSection = forwardRef((props, ref) => {
    /// REFS
    const boardRef = useRef(null);
    const inputRef = useRef(null);

    /// STATES
    const [fortuneTeller, setFortuneTeller] = useState(null);
    const [card, setCard] = useState(null);
    const [cards, setCards] = useState([]);
    const [imageMessage, setImageMessage] = useState(null);
    const [votesResult, setVotesResult] = useState([]);
    const [canProceed, setCanProceed] = useState(false);

    useImperativeHandle(ref, () => ({
        changeFortuneTeller(newTeller) {
            setFortuneTeller(newTeller);
        },
        myTurn(newCard) {
            const image = getImage(newCard);
            setCard(image[0]);
        },
        changeMessage(description) {
            setImageMessage(description);
        },
        showCards(newCards) {
            const toChange = getImage(newCards);
            setCards(toChange);
        },
        showVotes(data) {
            setCards([]);
            setCanProceed(true);
            const result = [];
            let i = 1;
            data.forEach((item) => {
                const toPush = {
                    creator: item.playerName,
                    image: getImage([item.number])[0],
                    votes: item.choices,
                    real: item.real,
                };
                if (!item.real) {
                    result[i++] = toPush;
                } else {
                    result[0] = toPush;
                }
            });
            setVotesResult(result);
        },
        cleanEverything() {
            setFortuneTeller(false);
            setCard(false);
            setCards(false);
            setImageMessage(null);
            setVotesResult(false);
        },
    }));

    const handleDescSubmit = () => {
        setCard(null);
        props.sendDescription(inputRef.current.value);
        setImageMessage(inputRef.current.value);
    };

    const handleVoteCard = (cardNumber) => {
        setCards([]);
        props.voteCard(cardNumber);
    };

    const nextTurn = () => {
        setCanProceed(false);
        props.nextTurn();
    };

    const { startGame, gameState, moderator } = props;

    if (gameState === "waiting")
        return (
            <section ref={boardRef}>
                {moderator ? (
                    <div
                        className="flex center column centralize-mobile"
                        style={{ marginLeft: "1vw" }}
                    >
                        <h3> O jogo ainda não começou, deseja começar?</h3>
                        <h1
                            onClick={startGame}
                            className="pointer"
                            style={{ textDecoration: "underline" }}
                        >
                            Começar
                        </h1>
                    </div>
                ) : !moderator ? (
                    <div
                        className="flex center column centralize-mobile"
                        style={{ marginLeft: "1vw" }}
                    >
                        <h3> O jogo ainda não começou </h3>
                    </div>
                ) : null}
            </section>
        );

    return (
        <section ref={boardRef}>
            {fortuneTeller ? (
                <h1 className="up">Vez de {fortuneTeller.substring(0, 15)}</h1>
            ) : null}
            {card ? (
                <div className="flex column center align-center up">
                    <img src={card.url} />
                    <input
                        ref={inputRef}
                        className="box-input"
                        type="text"
                        placeholder="Qual a descrição da imagem ?"
                    />
                    <input
                        type="submit"
                        className="box-input"
                        value="Enviar"
                        onClick={handleDescSubmit}
                    />
                </div>
            ) : null}
            {imageMessage !== null ? (
                <div className="flex align-center up">
                    <h1>"{imageMessage}"</h1>
                    {moderator && canProceed ? (
                        <div
                            style={{
                                marginLeft: 100,
                                marginTop: 7,
                            }}
                        >
                            <input
                                onClick={nextTurn}
                                type="submit"
                                className="box-input pointer"
                                value="Continuar"
                            />
                        </div>
                    ) : null}
                </div>
            ) : null}
            {cards ? (
                <div className="flex wrap">
                    {cards.map((item) => (
                        <div className="card-container up" key={item.number}>
                            <input
                                type="submit"
                                className="card-input-vote"
                                value="VOTE"
                                onClick={(e) => handleVoteCard(item.number)}
                            />
                            <img className="myCard" src={item.url} />
                        </div>
                    ))}
                </div>
            ) : null}

            {votesResult ? (
                <div className="flex wrap center">
                    {votesResult.map((item) => (
                        <div className={`flex column card ${item.real}`}>
                            <p> {item.creator.substring(0, 15)} </p>
                            <img src={item.image.url} />
                            <ul>
                                {!item.votes.length ? (
                                    <li> Sem votos :&#40; </li>
                                ) : (
                                    item.votes.map((name) => (
                                        <li> {name.substring(0, 15)} </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : null}
        </section>
    );
});

export default MainSection;
