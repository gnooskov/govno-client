import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router";

import { gameStore } from "../..";
import { GameLobby } from "../GameLobby/GameLobby";
import { GameTable } from "../GameTable/GameTable";
import { GameOver } from "../GameOver/GameOver";
import { Loader } from "../Loader/Loader";

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
    return <Loader label='Загрузка игрового говна...' />;
  }

  if (currentGame.ended) {
    return <GameOver />;
  }

  if (currentGame.started) {
    return <GameTable />
  }

  return <GameLobby />;
});
