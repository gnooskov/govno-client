import { makeObservable, observable } from 'mobx';

export class GameStore {
  ws = null;
  clientId = localStorage.getItem('clientId');
  nickname = localStorage.getItem('nickname');

  requestsQueue = [];
  rules = null;

  games = null;
  currentGame = null;
  gamesFetching = false;
  gamesFetched = false;
  gameStates = {};
  
  redirectToLobby = null;
  redirectToHome = null;

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
      rules: observable,
      nickname: observable,
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

  setNickname(nickname) {
    this.nickname = nickname;
    localStorage.setItem('nickname', nickname);
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

  reportMyNickname() {
    if (!this.nickname) {
      return;
    }

    this.wsSend({
      type: 'myNickname',
      payload: this.nickname,
    })
  }

  getLobbyDetails(gameNameEng) {
    this.wsSend({
      type: 'getLobbyDetails',
      payload: gameNameEng,
    });
  }

  setCurrentGame(gameInfo) {
    this.currentGame = gameInfo;
  }

  resetCurrentGame() {
    this.currentGame = null;
  }

  joinGame(gameNameEng) {
    this.wsSend({
      type: 'join',
      payload: gameNameEng,
    })
  }

  leaveGame(gameNameEng) {
    this.wsSend({
      type: 'leave',
      payload: gameNameEng,
    })
  }

  setRedirectToLobby(gameNameEng) {
    this.redirectToLobby = gameNameEng;
  }

  setRedirectToHome(state) {
    this.redirectToHome = state;
  }

  setRules(rules) {
    this.rules = rules;
  }

  startGame(gameNameEng) {
    this.wsSend({
      type: 'start',
      payload: gameNameEng,
    });
  }

  requestGameState(gameNameEng) {
    this.wsSend({
      type: 'getGameState',
      payload: gameNameEng,
    });
  }

  setGameState(game) {
    this.currentGame = game;
    this.gameStates[game.nameEng] = game;
  }

  currentGameState() {
    if (!this.currentGame) {
      return
    }
    return this.gameStates?.[this.currentGame.nameEng];
  }

  submitSwap(index) {
    this.wsSend({
      type: 'swapCard',
      payload: {
        gameNameEng: this.currentGame.nameEng,
        swap: index,
      }
    });
  }

  reportComplete() {
    this.wsSend({
      type: 'reportComplete',
      payload: {
        gameNameEng: this.currentGame.nameEng,
      }
    })
  }

  reportNewNickname(newNickname) {
    if (!newNickname) {
      return;
    }
    this.wsSend(({
      type: 'newNickname',
      payload: newNickname,
    }));
  }
}
