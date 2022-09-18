import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

import { GameStore } from './store/GameStore.js';
import { initWs } from './websocket/websocket';

export const gameStore = new GameStore();
export const ws = initWs(gameStore);
gameStore.setWs(ws);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
