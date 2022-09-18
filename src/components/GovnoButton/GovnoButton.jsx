import React from 'react';
import cn from 'classnames';

import styles from './GovnoButton.module.scss';

export const GovnoButton = ({
  onClick,
  disabled,
  className,
}) => {
  return (
    <div
      className={cn(
        styles.wrapper,
        disabled && styles.disabled,
        className
      )}
      onClick={() => {
        if (disabled) {
          return;
        }
        onClick();
      }}
    >
      <span className={styles.icon}>💩</span>
      <span className={styles.label}>ГОВНО!</span>
    </div>
  );
}
