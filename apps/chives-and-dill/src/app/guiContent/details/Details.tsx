import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React from 'react';
import styles from './Details.module.scss';
import { Player } from './Player/Player';
import { Header } from './Header/Header';

export const Details = () => {
  const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;

  return (
    <div className={styles.DetailsContainer}>
      <Header />
      <div className={styles.PlayerList}>
        <Player />
        <Player />
        <Player />
        <Player />
        <Player />
      </div>
    </div>
  )
}