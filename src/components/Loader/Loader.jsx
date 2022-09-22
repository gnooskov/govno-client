import React from "react";

import styles from './Loader.module.scss';

export const Loader = ({ label }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.spinner}>💩</span>
      <span className={styles.loadingLabel}>
        {label}
      </span>
    </div>
  )
}
