import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';

import { gameStore } from '../..';
import { PlayerHand } from '../PlayerHand/PlayerHand';
import { OpponentsHand } from '../OpponentsHand/OpponentsHand';

import { GovnoButton } from '../GovnoButton/GovnoButton';
import { ScoreBar } from '../ScoreBar/ScoreBar';
import { Loader } from '../Loader/Loader';

import styles from './GameTable.module.scss';

export const GameTable = observer(() => {
  const { gameNameEng } = useParams();
  const gameState = gameStore.currentGameState();

  useEffect(() => {
    if (!gameState) {
      gameStore.requestGameState(gameNameEng);
    }
  }, [gameNameEng, gameState])

  let tableNode;
  if (!gameState) {
    tableNode = <Loader label='Наполняем игру говном...' />;
  } else {
    const { swaps, myPlayerIndex, playerNicknames, scores } = gameState;
    const currentPlayerScore = scores[myPlayerIndex];

    const govnoCheck = () => {
      gameStore.reportComplete();
    }

    const swappedIndex = swaps[myPlayerIndex];

    const otherPlayersNodes = playerNicknames.reduce((acc, playerNickname, index) => {
      if (index === myPlayerIndex) {
        return acc;
      }
      const playerSwap = swaps[index];
      const playerScore = scores[index];
      acc.push(
        <div className={styles.otherDash}>
          <ScoreBar
            score={playerScore}
            className={styles.otherScore}
          />
          <OpponentsHand
            id={playerNickname}
            nickname={playerNickname}
            swap={playerSwap}
          />
        </div>
      );
      return acc;
    }, []);
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
      {tableNode}
    </>
  )
});
