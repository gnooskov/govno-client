import React from 'react';
import cn from 'classnames';

import { cardLabels } from '../../config/cardLabels';

import styles from './Card.module.scss';

export const Card = ({
  isOpen,
  value,
  showPlayIcon,
  onClick,
  className,
}) => {
  if (!isOpen) {
    return <div className={cn(styles.card, styles.closed, className)} />
  }

  const cardLabel = cardLabels[value];

  const playIcon = showPlayIcon
    ? <div className={styles.playOverlay} />
    : null;

  return (
    <div
      className={cn(styles.card, className)}
      onClick={onClick}
    >
      <span className={styles.value}>{cardLabel}</span>
      <span className={cn(styles.value, styles.inverse)}>{cardLabel}</span>
      <div className={styles.picture} />
      {playIcon}
    </div>
  )
}