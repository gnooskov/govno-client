import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import {gameStore} from "../../index";
import {observer} from "mobx-react-lite";

export const Header = observer(() => {
  const { nickname } = gameStore;

  const changeNickname = () => {
    const newNickname = prompt('Укажи свой новый ник', nickname);
    if (newNickname) {
      gameStore.reportNewNickname(newNickname);
    }
  }

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.link}>
        <span className={styles.emoji}>💩</span>
        <span className={styles.label}>Говно</span>
      </Link>

      <div
        className={styles.user}
        title='Нажми, чтобы сменить ник'
        onClick={changeNickname}
      >
        <span className={styles.userEmoji}>🧑</span>
        <span className={styles.nickname}>
          {nickname}
        </span>
      </div>
    </header>
  );
});
