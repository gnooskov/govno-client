import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { gameStore } from '.';
import { GamesList } from './components/GamesList/GamesList';
import { GameSwitch } from './components/GameSwitch/GameSwitch';

import styles from './App.module.scss';
import './globalStyles.scss';
import { Loader } from './components/Loader/Loader';

export const App = observer(() => {
  const { clientId, rules } = gameStore;

  useEffect(() => {
    if (rules === null) {
      gameStore.requestRules();
    }

    if (!clientId) {
      gameStore.requestClientId();
    } else {
      gameStore.reportMyClientId();
    }
  }, [clientId, rules]);

  const content = (clientId && rules)
    ? (
      <Routes>
        <Route path="/" exact element={<GamesList />} />
        <Route path="/game/:gameId" exact element={<GameSwitch />} />
      </Routes>
    )
    : <Loader label='Грузим говно...' />

  return (
    <BrowserRouter>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <span className={styles.emoji}>💩</span>
          <span className={styles.label}>Говно</span>
          <Link to='/' className={styles.link} />
        </header>
        <main className={styles.body}>
          <div className={styles.paper}>
            {content}
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
})
