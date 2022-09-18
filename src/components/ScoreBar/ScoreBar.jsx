import React from 'react';
import cn from 'classnames';

import { gameStore } from '../..';

import styles from './ScoreBar.module.scss';

export const ScoreBar = ({ score, className }) => {
  const { rules } = gameStore;
  const { maxScore } = rules;
  const emptiesCount = maxScore - score;
  const empties = [];
  const poops = [];
  for (let i = 0; i < emptiesCount; i++) {
    empties.push(<span key={i} className={styles.empty}>⬜</span>);
  }
  for (let i = 0; i < score; i++) {
    poops.push(<span key={i} className={styles.poop}>💩</span>);
  }

  return (
    <div className={cn(styles.wrapper, className)}>
      {empties}
      {poops}
    </div>
  )
}
