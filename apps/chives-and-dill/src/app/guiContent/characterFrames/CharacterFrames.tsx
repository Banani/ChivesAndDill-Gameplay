import React from 'react';
import { PlayerIcon } from './playerIcon/PlayerIcon';
import { TargetIcon } from './targetIcon/TargetIcon';
import { selectActiveCharacterId } from '../../../stores';
import { useSelector } from 'react-redux';
import styles from './CharacterFrames.module.scss';

export const CharacterFrames = () => {

   const activePlayerId = useSelector(selectActiveCharacterId);

   return (
      <div className={styles.CharacterFrames}>
         {activePlayerId ? <PlayerIcon playerId={activePlayerId}></PlayerIcon> : null}
         <TargetIcon />
      </div>
   )
};
