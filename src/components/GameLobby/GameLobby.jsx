import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Link, Navigate } from "react-router-dom";
import { observer } from 'mobx-react-lite';

import { gameStore } from '../../index.js';

export const GameLobby = observer(() => {
  const { gameId } = useParams();
  const { clientId, currentGame, redirectToHome, rules } = gameStore;
  const playerIds = currentGame?.playerIds || null
  const gameStarted = currentGame?.started || false

  useEffect(() => {
    gameStore.getLobbyDetails(gameId);
    gameStore.setRedirectToLobby(null);

    return () => {
      gameStore.setCurrentGame(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gameStarted) {
    return <div>Game started!</div>;
  }

  if (redirectToHome) {
    return <Navigate to='/' />;
  }

  if (!rules || !currentGame) {
    return <div>Loading game info...</div>;
  }

  const imIn = currentGame
    ? playerIds?.includes(gameStore.clientId) || false
    : false;

  const playersList = currentGame
    ? (
      <div>
        <h3>Players:</h3>
        {playerIds.map(playerId => {
          const isYou = playerId === clientId;
          const playerLabel = isYou ? 'You' : playerId;

          return (<div key={playerId}>{playerLabel}</div>)
        })}
      </div>
    )
    : null;

  let joinGameButton;
  let leaveGameButton;

  if (currentGame) {
    if (imIn) {
      leaveGameButton = (
        <button onClick={() => {
          gameStore.leaveGame(currentGame.id);
        }}>
          Leave game
        </button>
      );
    } else {
      joinGameButton = (
        <button onClick={() => {
          gameStore.joinGame(currentGame.id);
        }}>
          Join this game
        </button>
      );
    }
  }

  let startButton;
  if (playerIds.length >= rules.minPlayers) {
    startButton = (
      <button onClick={() => {
        gameStore.startGame(currentGame.id)
      }}>start game</button>
    )
  }

  return (
    <div>
      <h1>lobby</h1>
      {playersList}
      {joinGameButton}
      {leaveGameButton}
      {startButton}
      <div>
        <Link to='/'>
          Back to games list
        </Link>
      </div>
    </div>
  )
});
