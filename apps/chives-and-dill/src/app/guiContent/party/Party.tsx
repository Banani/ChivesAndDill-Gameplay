import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import leaderIcon from '../../../assets/spritesheets/icons/leaderIcon.png';
import { GameControllerContext } from '../../gameController/gameController';
import styles from './Party.module.scss';

export const PartyModal = () => {
    const { data: party } = useEngineModuleReader(GlobalStoreModule.PARTY);
    const { data: character } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
    const { data: characterPowerPoints } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
    const { data: charactersMovements } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);

    const [activeGroup, setActiveGroup] = useState<any>({});
    const { activeTargetId, setActiveTarget } = useContext(GameControllerContext);

    useEffect(() => {
        findActivePlayerGroup();
    }, [party])

    const findActivePlayerGroup = () => {
        setActiveGroup({});
        for (const key in party) {
            const group = party[key];
            if (group['membersIds'][activeCharacterId]) {
                setActiveGroup(group);
            }
        }
    };

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

    return (
        <div className={styles.PartyContainer}>
            {_.map(activeGroup['membersIds'], (value, playerId) => {
                const player = character[playerId];
                const powerPoints = characterPowerPoints[playerId];

                return (
                    <div
                        className={styles.PartyMember}
                        onClick={() => setActiveTarget(playerId)}
                        style={{
                            border: activeTargetId === playerId ? '1px solid #ffc506' : '',
                        }}
                    >
                        <div
                            style={{
                                width: `${(powerPoints.currentHp / powerPoints.maxHp) * 100}%`,
                                background: checkIfPlayerIsFarAway(playerId) ? 'rgb(0, 80, 0)' : 'linear-gradient(90deg, rgba(0, 255, 119, 0.5) 0%, rgba(5, 61, 0, 0.8) 100%)',
                            }}
                            className={styles.PartyMemberColorBar}></div>
                        <div className={styles.PartyMemberData}>
                            <div className={styles.PartyMemberName}>{player.name}</div>
                            {activeGroup.leader === playerId ? <img className={styles.LeaderIcon} src={leaderIcon} alt='leader' /> : null}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
