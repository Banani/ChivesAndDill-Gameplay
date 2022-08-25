import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React from 'react';
import styles from './CharacterFrames.module.scss';
import { PlayerIcon } from './playerIcon/PlayerIcon';
import { TargetIcon } from './targetIcon/TargetIcon';

export const CharacterFrames = () => {
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;

   return (
      <div className={styles.CharacterFrames}>
         {activeCharacterId ? <PlayerIcon playerId={activeCharacterId}></PlayerIcon> : null}
         <TargetIcon />
      </div>
   );
};
