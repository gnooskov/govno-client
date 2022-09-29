import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, Navigate } from 'react-router-dom';

import { gameStore } from '../../index.js';

import styles from './GamesList.module.scss';
import { Loader } from '../Loader/Loader.jsx';

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
    return <Loader label='Подключение к сетевой розетке...' />;
  }

  let gamesNodes;
  if (gamesFetching) {
    gamesNodes = <Loader label='Загрузка списка игр...' />;
  } else {
    gamesNodes = games?.reduce((acc, game) => {
      const { id, name, nameEng, iParticipate, ended } = game;

      if (ended) {
        return acc;
      }

      const imInLabel = iParticipate ? ` (я участвую)` : '';

      acc.push(
        <div className={styles.gameLine} key={id}>
          <Link to={`/game/${nameEng}`}>
            {name}
          </Link>
          {imInLabel}
        </div>
      );

      return acc;
    }, []) || []
    
    if (!gamesNodes.length) {
      gamesNodes = (
        <div className={styles.noGames}>
          Игр нет
        </div>
      );
    }
  }

  const createGame = () => {
    gameStore.createGame();
  }

  return (
    <div className={styles.wrapper}>
      <h1>Список игр</h1>
      <div className={styles.list}>
        {gamesNodes}
      </div>
      <button className={styles.create} onClick={createGame}>
        Создать игру
      </button>
    </div>
  )
})
