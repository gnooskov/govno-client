import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Link, Navigate } from "react-router-dom";
import { observer } from 'mobx-react-lite';

import { gameStore } from '../../index.js';

import styles from './GameLobby.module.scss';

export const GameLobby = observer(() => {
  const { gameNameEng } = useParams();
  const { currentGame, redirectToHome, rules } = gameStore;

  const gameStarted = currentGame?.started || false;

  useEffect(() => {
    gameStore.getLobbyDetails(gameNameEng);
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

  const { iParticipate, playerNicknames, myPlayerIndex } = currentGame;

  const playersList = currentGame
    ? (
      <div className={styles.players}>
        <h3>Игроки</h3>
        {playerNicknames.map((playerNickname, index) => {
          const isYouLabel = index === myPlayerIndex
            ? ' (Ты)'
            : '';

          return (
            <div className={styles.player} key={playerNickname}>
              {playerNickname}{isYouLabel}
            </div>
          );
        })}
      </div>
    )
    : null;

  let joinGameButton;
  let leaveGameButton;

  if (currentGame) {
    if (iParticipate) {
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
  if (playerNicknames.length >= minPlayers) {
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
