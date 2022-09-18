import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router";

import { gameStore } from "../..";
import { GameLobby } from "../GameLobby/GameLobby";
import { GameTable } from "../GameTable/GameTable";
import { Link } from "react-router-dom";

export const GameSwitch = observer(() => {
  const { gameId } = useParams();
  const { currentGame } = gameStore;

  useEffect(() => {
    if (!currentGame) {
      gameStore.getLobbyDetails(gameId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentGame) {
    return <div>Loading game data...</div>;
  }

  if (currentGame.ended) {
    return (
      <div>
        <h1>Game has ended!</h1>
        <Link to='/'>
          Go to games list
        </Link>
      </div>
    )
  }

  if (currentGame.started) {
    return <GameTable />
  }

  return <GameLobby />;
});
