import React from 'react';
import cn from 'classnames';

import { gameStore } from '../..';
import { Card } from '../Card/Card';

import styles from './OpponentsHand.module.scss';

export const OpponentsHand = ({
  swap,
  nickname,
  className,
}) => {
  const { rules } = gameStore;
  const { cardsPerPlayer } = rules;

  const cardNodes = [];
  for (let i = 0; i < cardsPerPlayer; i++) {
    const isSwapped = i === swap;

    cardNodes.push(
      <Card
        key={i}
        isOpen={false}
        className={cn(
          isSwapped && styles.swappedCard,
        )}
      />
    )
  }

  const swapNode = swap !== null
    ? <Card isOpen={false} />
    : null;

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.playerName}>
        {nickname}
      </div>
      <div className={styles.hand}>
        <div className={styles.swap}>
          {swapNode}
        </div>
        <div className={styles.cards}>
          {cardNodes}
        </div>
      </div>
    </div>
  )
};
