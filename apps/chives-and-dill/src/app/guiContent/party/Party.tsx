import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import styles from './Party.module.scss';
import leaderIcon from '../../../assets/spritesheets/icons/leaderIcon.png';
import { Party } from 'libs/types/src/GroupPackage';
import { setActiveTarget } from 'apps/chives-and-dill/src/stores';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveTargetId } from '../../../stores';

export const PartyModal = () => {
  const { data: party } = useEngineModuleReader(GlobalStoreModule.PARTY);
  const { data: character } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
  const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
  const { data: characterPowerPoints } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
  const { data: charactersMovements } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);

  const [activeGroup, setActiveGroup] = useState<any>({});
  const dispatch = useDispatch();
  const activeTargetId = useSelector(selectActiveTargetId);

  useEffect(() => {
    findActivePlayerGroup();
  }, [party])

  const findActivePlayerGroup = () => {
    for (const key in party) {
      const group = party[key];
      if (group['membersIds'][activeCharacterId]) {
        setActiveGroup(group);
        return group;
      }
    }
  };

  useEffect(() => {

  }, [charactersMovements])

  const calculateDistance = (player1, player2) => {
    const deltaX = player2.x - player1.x;
    const deltaY = player2.y - player1.x;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return distance;
  }

  const checkIfPlayerIsFarAway = (targetId) => {
    if (targetId === activeCharacterId) return false;

    const targetLocation = charactersMovements[targetId].location;
    const activePlayerLocation = charactersMovements[activeCharacterId].location;

    return calculateDistance(activePlayerLocation, targetLocation) > 1000 ? true : false;
  }

  const partyMembers = _.map(activeGroup['membersIds'], (value, playerId) => {
    const player = character[playerId];
    const powerPoints = characterPowerPoints[playerId];

    return (
      <div
        className={styles.PartyMember}
        onClick={() => dispatch(setActiveTarget({ characterId: playerId }))}
        style={{
          border: activeTargetId === playerId ? '1px solid gold' : '',
        }}
      >
        <div
          style={{
            width: `${(powerPoints.currentHp / powerPoints.maxHp) * 100}%`,
            backgroundColor: checkIfPlayerIsFarAway(playerId) ? 'rgb(0, 80, 0)' : 'rgb(0, 130, 0)',
          }}
          className={styles.PartyMemberColorBar}></div>
        <div className={styles.PartyMemberData}>
          <div className={styles.PartyMemberName}>{player.name}</div>
          {activeGroup.leader === playerId ? <img className={styles.LeaderIcon} src={leaderIcon} alt='leader' /> : null}
        </div>
      </div>
    )
  })

  return (
    <div className={styles.PartyContainer}>
      {partyMembers}
    </div>
  )
}
