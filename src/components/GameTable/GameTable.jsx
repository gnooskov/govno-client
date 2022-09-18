import React from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';

import { gameStore } from '../..';
import { PlayerHand } from '../PlayerHand/PlayerHand';
import { OpponentsHand } from '../OpponentsHand/OpponentsHand';

import styles from './GameTable.module.scss';
import { GovnoButton } from '../GovnoButton/GovnoButton';
import { ScoreBar } from '../ScoreBar/ScoreBar';

export const GameTable = observer(() => {
  const { clientId } = gameStore;
  const { gameId } = useParams();
  const gameState = gameStore.currentGameState();

  let tableNode;
  if (!gameState) {
    gameStore.requestGameState(gameId);
    tableNode = (
      <span>Loading...</span>
    )
  } else {
    const { swaps, playerIds, scores } = gameState;
    const currentPlayerScore = scores[clientId];

    const govnoCheck = () => {
      gameStore.reportComplete();
    }

    const swappedIndex = swaps[clientId];
    const otherPlayers = playerIds.filter(player => player !== clientId)
    const otherPlayersNodes = otherPlayers.map(player => {
      const playerSwap = swaps[player];
      const playerScore = scores[player];
      return (
        <div className={styles.otherDash}>
          <ScoreBar
            score={playerScore}
            className={styles.otherScore}
          />
          <OpponentsHand
            id={player}
            swap={playerSwap}
          />
        </div>
      );
    });
    tableNode = (
      <div className={styles.wrapper}>
        <div className={styles.currentPlayer}>
          <div className={styles.currentDash}>
            <ScoreBar
              score={currentPlayerScore}
              className={styles.currentPlayerScore}
            />
            <PlayerHand
              hand={gameState.hand}
              swappedIndex={swappedIndex}
            />
          </div>
          <GovnoButton
            onClick={govnoCheck}
            className={styles.govnoButton}
          />
        </div>
        <div className={styles.otherPlayers}>
          {otherPlayersNodes}
        </div>
      </div>
    )
  }

  return (
    <>
      <h1>Game</h1>
      {tableNode}
    </>
  )
});
