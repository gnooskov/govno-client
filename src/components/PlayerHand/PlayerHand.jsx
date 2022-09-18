import React, { useState } from 'react';
import cn from 'classnames';

import { Card } from '../Card/Card';

import styles from './PlayerHand.module.scss';
import { gameStore } from '../..';

export const PlayerHand = ({
  hand,
  swappedIndex,
}) => {
  const [indexToSwap, setIndexToSwap] = useState(null);
  const swapAvailable = swappedIndex === null;

  let swapNode;

  const cardNodes = hand.map((value, index) => {
    const isSelected = index === indexToSwap;
    const isSwapped = index === swappedIndex;
    if (isSwapped) {
      swapNode = (
        <Card
          isOpen
          value={value}
        />
      );
    }
    return (
      <Card
        isOpen
        value={value}
        showPlayIcon={isSelected}
        className={cn(
          styles.card,
          swapAvailable && styles.swapAvailable,
          isSelected && styles.cardSelected,
          isSwapped && styles.swapped
        )}
        onClick={() => {
          if (!swapAvailable) {
            return;
          }

          if (isSelected) {
            gameStore.submitSwap(index);
            setIndexToSwap(null);
          } else {
            setIndexToSwap(index);
          }
        }}
      />
    );
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.hand}>
        {cardNodes}
      </div>
      <div className={styles.swap}>
        {swapNode}
      </div>
    </div>
  )
}