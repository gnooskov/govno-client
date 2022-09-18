import { makeObservable, observable } from 'mobx';

export class GameStore {
  ws = null;
  clientId = localStorage.getItem('clientId');

  requestsQueue = [];
  rules = null;

  games = null;
  currentGame = null;
  gamesFetching = false;
  gamesFetched = false;
  gameStates = {};
  
  redirectToLobby = null;
  redirectToHome = null;
  redirectToGame = null;

  constructor() {
    makeObservable(this, {
      games: observable,
      gamesFetching: observable,
      gamesFetched: observable,
      gameStates: observable,
      ws: observable,
      clientId: observable,
      currentGame: observable,
      redirectToLobby: observable,
      redirectToHome: observable,
      redirectToGame: observable,
      rules: observable,
    });
  }

  setWs(ws) {
    ws.onopen = () => {
      this.requestsQueue.forEach((request) => {
        this.wsSend(request);
      });
      this.requestsQueue = [];
    }
    this.ws = ws;
  }

  setGames(games) {
    this.games = games;
    this.gamesFetching = false;
    this.gamesFetched = true;
  }

  queueRequest(object) {
    this.requestsQueue.push(object);
  }

  wsSend(object) {
    if (!this.ws) {
      console.warn('No WebSocket yet');
      this.queueRequest(object);
      return;
    }

    if (this.ws.readyState !== 1) {
      console.warn('WebSocket not ready');
      this.queueRequest(object);
      return;
    };

    this.ws.send(JSON.stringify(object));
  }

  requestGamesList() {
    this.wsSend({
      type: 'gamesList'
    });

    this.gamesFetching = true;
  }

  reportGamesListWatchingStatus(status) {
    this.wsSend({
      type: 'gamesListWatchingStatus',
      payload: status,
    });
  }

  requestRules() {
    this.wsSend({
      type: 'rules'
    });
  }

  createGame() {
    this.wsSend({
      type: 'createGame',
    })
  }

  requestClientId() {
    this.wsSend({
      type: 'requestId',
    })
  }

  setClientId(clientId) {
    this.clientId = clientId;
    localStorage.setItem('clientId', clientId);
  }

  reportMyClientId() {
    if (!this.clientId) {
      return;
    }

    this.wsSend({
      type: 'myClientId',
      payload: this.clientId,
    });
  }

  getLobbyDetails(gameId) {
    this.wsSend({
      type: 'getLobbyDetails',
      payload: gameId,
    });
  }

  setCurrentGame(gameInfo) {
    this.currentGame = gameInfo;
  }

  resetCurrentGame() {
    this.currentGame = null;
  }

  joinGame(gameId) {
    this.wsSend({
      type: 'join',
      payload: gameId,
    })
  }

  leaveGame(gameId) {
    this.wsSend({
      type: 'leave',
      payload: gameId,
    })
  }

  setRedirectToLobby(gameId) {
    this.redirectToLobby = gameId;
  }

  setRedirectToHome(state) {
    this.redirectToHome = state;
  }

  setRedirectToGame(gameId) {
    this.redirectToGame = gameId;
  }

  setRules(rules) {
    this.rules = rules;
  }

  startGame(gameId) {
    this.wsSend({
      type: 'start',
      payload: gameId,
    });
  }

  requestGameState(gameId) {
    this.wsSend({
      type: 'getGameState',
      payload: gameId,
    });
  }

  setGameState(game) {
    this.currentGame = game;
    this.gameStates[game.id] = game;
  }

  currentGameState() {
    if (!this.currentGame) {
      return
    }
    return this.gameStates?.[this.currentGame.id];
  }

  submitSwap(index) {
    this.wsSend({
      type: 'swapCard',
      payload: {
        gameId: this.currentGame.id,
        swap: index,
      }
    });
  }

  reportComplete() {
    this.wsSend({
      type: 'reportComplete',
      payload: {
        gameId: this.currentGame.id,
      }
    })
  }
}
