import React from 'react';
import { Link } from 'react-router-dom';
import { gameStore } from '../../index';

import styles from './GameOver.module.scss';

export const GameOver = () => {
  const { currentGame, rules } = gameStore;
  const { maxScore } = rules;
  const { scores, myPlayerIndex, playerNicknames } = currentGame;

  let loserIndex = -1;
  let biggestScore = -1;
  for (let i = 0; i < playerNicknames.length; i++) {
    if (scores[i] > biggestScore) {
      loserIndex = i;
      biggestScore = scores[i];
    }
  }
  const loserName = playerNicknames[loserIndex];

  const playerNodes = playerNicknames.reduce((acc, nickname, index) => {
    const isMe = index === myPlayerIndex;
    const score = scores[index];
    const emptyNodes = new Array(maxScore - score).fill(<span className={styles.point}>⬜</span>);
    const poopNodes = new Array(score).fill(<span className={styles.point}>💩</span>);
    acc.push(
      <div className={styles.player}>
        <div className={styles.score}>
          {emptyNodes}
          {poopNodes}
        </div>
        <div className={styles.name}>
          {nickname}{`${isMe ? ' (ты)' : ''}`}
        </div>
      </div>
    )
    return acc;
  }, []);

  return (
    <div>
      <h1>{loserName} теперь покоится под горой говна</h1>
      <div className={styles.players}>
        {playerNodes}
      </div>
      <Link to='/'>
        <button>К списку игр</button>
      </Link>
    </div>
  )
}
