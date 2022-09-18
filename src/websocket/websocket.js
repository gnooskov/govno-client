export const wsParser = (data, gameStore) => { 
  const { type, payload } = JSON.parse(data);

  if (type === 'rules') {
    gameStore.setRules(payload);
  }

  if (type === 'gamesList') {
    gameStore.setGames(payload);
  }

  if (type === 'clientId') {
    gameStore.setClientId(payload);
  }

  if (type === 'gameCreated') {
    gameStore.setCurrentGame(payload);
    gameStore.setRedirectToLobby(payload.id);
  }

  if (type === 'gameDetails') {
    if (!gameStore.currentGame?.id || payload.id === gameStore.currentGame?.id) {
      gameStore.setCurrentGame(payload);
    }
  }

  if (type === 'gameNotFound') {
    gameStore.setRedirectToHome(true);
  }

  if (type === 'gameStarted') {
    gameStore.setCurrentGame(payload);
  }

  if (type === 'gameState') {
    gameStore.setGameState(payload);
  }
}

export const initWs = (gameStore) => {
  let ws = new WebSocket('ws://localhost:6969');
  ws.onopen = () => {
    console.log('Connected');
  }

  ws.onerror = (e) => {
    console.error('Error while connecting', e);
  }

  ws.onmessage = ({ data }) => {
    if (data instanceof Blob) {
      const reader = new FileReader();

      reader.onload = () => {
        wsParser(reader.result, gameStore);
      };

      reader.readAsText(data);
    } else {
      wsParser(data, gameStore);
    }
  }

  ws.onclose = () => {
    ws = null;
  }
  
  return ws;
}
