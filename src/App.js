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

import './globalStyles.scss';

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

  if (!clientId || !rules) {
    return <span>Loading data...</span>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<GamesList />} />
        <Route path="/game/:gameId" exact element={<GameSwitch />} />
      </Routes>
    </BrowserRouter>
  );
})
