import React from 'react';
import { useSelector } from 'react-redux';
import { getActiveConversation, selectCharacters, selectActiveCharacterId } from '../../../stores/engineStateModule/selectors';
import styles from "./NpcModal.module.scss";

export const NpcModal = () => {

  const activeConversation = useSelector(getActiveConversation);
  const activePlayerId = useSelector(selectActiveCharacterId);
  const players = useSelector(selectCharacters);

  const activeNpc = players[activeConversation[activePlayerId]?.npcId];

  return (
    activeNpc ? <div className={styles.NpcModal}>
      <img className={styles.Avatar} src={activeNpc.avatar} alt={''} />
      <div className={styles.Name}>{activeNpc.name}</div>
    </div> : null
  )
}