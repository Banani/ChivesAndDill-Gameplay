import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React from 'react';
import styles from './ExperienceBar.module.scss';

export const ExperienceBar = () => {
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: experience } = useEngineModuleReader(GlobalStoreModule.EXPERIENCE);

   const { experienceAmount, toNextLevel } = experience[activeCharacterId];

   const levelProgress = (experienceAmount / toNextLevel) * 100;

   return (
      <div className={styles.ExperienceBar}>
         <div className={styles.ProgressBar} style={{ width: levelProgress + '%' }}></div>
         <div className={styles.ProgressBarDetails}>{experienceAmount + ' / ' + toNextLevel + ' (' + levelProgress.toFixed(2) + ' %) exp'}</div>
      </div>
   );
};
