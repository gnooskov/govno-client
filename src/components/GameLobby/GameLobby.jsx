import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Link, Navigate } from "react-router-dom";
import { observer } from 'mobx-react-lite';

import { gameStore } from '../../index.js';

import styles from './GameLobby.module.scss';

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
      <div className={styles.players}>
        <h3>Игроки</h3>
        {playerIds.map(playerId => {
          const isYou = playerId === clientId;
          const playerLabel = isYou ? 'You' : playerId;

          return <div className={styles.player} key={playerId}>{playerLabel}</div>;
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
          Покинуть игру
        </button>
      );
    } else {
      joinGameButton = (
        <button onClick={() => {
          gameStore.joinGame(currentGame.id);
        }}>
          Присоединиться
        </button>
      );
    }
  }

  const { minPlayers, maxPlayers } = rules;

  let startButton;
  if (playerIds.length >= minPlayers) {
    startButton = (
      <button onClick={() => {
        gameStore.startGame(currentGame.id)
      }}>Начать игру</button>
    )
  }

  return (
    <div>
      <h1>Собираемся играть</h1>
      {playersList}
      <div className={styles.rulesBlock}>
        <div>
          Минимальное число игроков для начала: {minPlayers}
        </div>
        <div>
          Максимальное число игроков: {maxPlayers}
        </div>
      </div>
      <div className={styles.mainButtons}>
        {joinGameButton}
        {leaveGameButton}
        {startButton}
      </div>
      <div className={styles.backWrapper}>
        <Link to='/'>
          <button>
            Назад к списку игр
          </button>
        </Link>
      </div>
    </div>
  )
});
