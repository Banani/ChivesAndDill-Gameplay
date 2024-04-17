import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import styles from './Party.module.scss';
import { PartyMember } from './partyMember/PartyMember';

export const PartyModal = () => {
    const { data: party, lastUpdateTime: lastUpdateTimeParty } = useEngineModuleReader(GlobalStoreModule.PARTY);
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;

    const [activeGroup, setActiveGroup] = useState<any>({});

    useEffect(() => {
        findActivePlayerGroup();
    }, [lastUpdateTimeParty])

    const findActivePlayerGroup = () => {
        setActiveGroup({});
        for (const key in party) {
            const group = party[key];
            if (group['membersIds'][activeCharacterId]) {
                setActiveGroup(group);
            }
        }
    };

    return (
        <div className={styles.PartyContainer}>
            {_.map(activeGroup['membersIds'], (value, playerId) => {
                return (
                    <PartyMember
                        playerId={playerId}
                        activeGroup={activeGroup}
                    />
                )
            })}
        </div>
    )
};