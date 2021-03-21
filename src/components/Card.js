import React from "react";

function Card({ number, canSend, handleCardSubmit, url }) {
    return (
        <>
            <div className="card-container">
                <input
                    type="submit"
                    className={`card-input cansend-${canSend}`}
                    value="→"
                    key={number}
                    onClick={(e) => handleCardSubmit(number)}
                    disabled={!canSend}
                />
                <div
                    style={{ "--image-background": `url(${url})` }}
                    className="myCard"
                    key={number}
                />
            </div>
        </>
    );
}

export default Card;
