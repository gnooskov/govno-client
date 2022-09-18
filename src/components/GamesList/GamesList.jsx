import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, Navigate } from 'react-router-dom';

import { gameStore } from '../../index.js';

import styles from './GamesList.module.scss';

export const GamesList = observer(() => {
  const { ws, gamesFetching, games, redirectToLobby } = gameStore;

  useEffect(() => {
    gameStore.resetCurrentGame();
    gameStore.setRedirectToHome(false);
    gameStore.reportGamesListWatchingStatus(true);

    return () => {
      gameStore.reportGamesListWatchingStatus(false);
    }
  }, []);

  useEffect(() => {
    if (games === null) {
      gameStore.requestGamesList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws]);

  if (redirectToLobby) {
    return <Navigate to={`/game/${redirectToLobby}`} />;
  }

  if (!ws) {
    return (
      <div>
        Connecting to websocket...
      </div>
    );
  }

  let gamesNodes;
  if (gamesFetching) {
    gamesNodes = <span>Loading games...</span>;
  } else {
    gamesNodes = games?.length
      ? games.map((game) => {
        const { id, playerIds, ended } = game;
        const imIn = playerIds.includes(gameStore.clientId);
        const imInLabel = imIn ? ` (i participate)` : '';

        if (ended) {
          return (
            <div key={id}>
              {id} (ended)
            </div>
          )
        }

        return (
          <div key={id}>
            <Link to={`/game/${id}`}>
              {id}{imInLabel}
            </Link>
          </div>
        );
      })
      : (
        <div>no games</div>
      );
  }

  const createGame = () => {
    gameStore.createGame();
  }

  return (
    <div className={styles.wrapper}>
      <h1>Games list</h1>
      <div className={styles.list}>
        {gamesNodes}
      </div>
      <button onClick={createGame}>
        create game
      </button>
    </div>
  )
})
