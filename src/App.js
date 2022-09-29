import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { gameStore } from '.';
import { GamesList } from './components/GamesList/GamesList';
import { GameSwitch } from './components/GameSwitch/GameSwitch';

import { Loader } from './components/Loader/Loader';
import { Header } from "./components/Header/Header";

import './globalStyles.scss';
import styles from './App.module.scss';

export const App = observer(() => {
  const { clientId, nickname, rules } = gameStore;

  useEffect(() => {
    if (rules === null) {
      gameStore.requestRules();
    }

    if (!clientId) {
      gameStore.requestClientId();
    } else {
      gameStore.reportMyClientId();
    }

    if (nickname) {
      gameStore.reportMyNickname(nickname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, rules]);

  const content = (clientId && rules)
    ? (
      <Routes>
        <Route path="/" exact element={<GamesList />} />
        <Route path="/game/:gameNameEng" exact element={<GameSwitch />} />
      </Routes>
    )
    : <Loader label='Грузим говно...' />

  return (
    <BrowserRouter>
      <div className={styles.wrapper}>
        <Header />
        <main className={styles.body}>
          <div className={styles.paper}>
            {content}
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
})
