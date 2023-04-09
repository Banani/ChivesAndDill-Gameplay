import React, { useState, useEffect } from 'react';
import styles from './Backpacks.module.scss';
import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from '../../../hooks';
import _ from 'lodash';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

export const Backpacks = () => {

  const { data: backpackSchema } = useEngineModuleReader(GlobalStoreModule.BACKPACK_SCHEMA);
  const { data: backpackItems } = useEngineModuleReader(GlobalStoreModule.BACKPACK_ITEMS);
  const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;

  const [backpacksVisibility, changeBackpacksVisibility] = useState(true);

  useEffect(() => {
    if (backpackItems[activeCharacterId]) {
      const backpackItemsView = _.map(backpackItems[activeCharacterId][1], backpack => (
        <div className={styles.backpack}></div>
      ));
    }
  }, [backpackItems, activeCharacterId]);

  const backpacks = _.map(backpackSchema[activeCharacterId], backpack => (
    <div className={styles.backpack}></div>
  ));

  return (
    <div>
      <div className={styles.backpacksContainer}>
        {backpacks}
      </div>
      <p className={styles.availableSlots}>(100)</p>
      <button className={styles.expandBackpacksIcon} onClick={() => changeBackpacksVisibility(!backpacksVisibility) as any}>
        {backpacksVisibility === true ? <ArrowRightIcon /> : <ArrowLeftIcon />}
      </button>
    </div>

  )

}