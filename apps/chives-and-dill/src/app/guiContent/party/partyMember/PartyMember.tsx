import { GlobalStoreModule } from '@bananos/types';
import { GameControllerContext } from 'apps/chives-and-dill/src/contexts/GameController';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks/useEngineModuleReader';
import React, { useContext, useRef, useState } from 'react';
import leaderIcon from '../../../../assets/spritesheets/icons/leaderIcon.png';
import { OptionsModal } from '../../characterFrames/optionsModal/OptionsModal';
import styles from './PartyMember.module.scss';

export const PartyMember = ({ playerId, activeGroup }) => {

  const [optionsVisible, setOptionsVisible] = useState(false);
  const { activeTargetId, setActiveTarget } = useContext(GameControllerContext);

  const { data: character } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
  const { data: characterPowerPoints } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
  const { data: charactersMovements } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);
  const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
  const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
  const { data: characterClasses } = useEngineModuleReader(GlobalStoreModule.CHARACTER_CLASS);

  const ref = useRef<HTMLDivElement>(null);
  const player = character[playerId];
  const powerPoints = characterPowerPoints[playerId];

  const classColor = characterClasses[characters[playerId].characterClassId].color;

  const calculateDistance = (player1, player2) => {
    const deltaX = player2.x - player1.x;
    const deltaY = player2.y - player1.x;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  const checkIfPlayerIsFarAway = (targetId) => {
    if (targetId === activeCharacterId) return false;

    const targetLocation = charactersMovements[targetId].location;
    const activePlayerLocation = charactersMovements[activeCharacterId].location;

    return calculateDistance(activePlayerLocation, targetLocation) > 1000 ? true : false;
  }

  const memberClick = (e) => {
    e.preventDefault();
    setOptionsVisible(prevState => !prevState);
  }

  return (
    <>
      <div
        className={styles.PartyMember}
        onClick={() => setActiveTarget(playerId)}
        style={{
          border: activeTargetId === playerId ? '2px solid #ffc506' : '',
          backgroundColor: classColor,
        }}
        ref={ref}
        onContextMenu={(e) => memberClick(e)}
      >
        <div
          style={{
            width: `${(powerPoints.currentHp / powerPoints.maxHp) * 100}%`,
            backgroundColor: checkIfPlayerIsFarAway(playerId) ? 'rgba(0, 0, 0, 0.5)' : '',
          }}
          className={styles.PartyMemberColorBar}>
        </div>
        <div className={styles.PartyMemberData}>
          <div className={styles.PartyMemberName}
            style={{ color: playerId === activeCharacterId ? 'gold' : 'white', }}
          >{player.name}</div>
          {activeGroup.leader === playerId ? <img className={styles.LeaderIcon} src={leaderIcon} alt='leader' /> : null}
          {optionsVisible ? <OptionsModal openTooltipContainer={ref} optionsVisible={optionsVisible} setOptionsVisible={setOptionsVisible} playerId={playerId} /> : null}
        </div>
      </div>
    </>
  )
}