import React, { useState, forwardRef, useImperativeHandle } from "react";

const PlayersList = forwardRef((props, ref) => {
    const [Players, setPlayers] = useState([]);

    useImperativeHandle(ref, () => ({
        updatePlayers(players) {
            setPlayers(players);
        },
    }));

    return (
        <div className="players" style={{ float: "right" }}>
            {Players.map((player) => (
                <>
                    <p>{player.substring(0, 10)}</p>
                </>
            ))}
        </div>
    );
});

export default PlayersList;
