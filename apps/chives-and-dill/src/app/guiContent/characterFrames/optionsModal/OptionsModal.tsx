import { GlobalStoreModule, GroupClientMessages } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React, { useContext } from 'react';
import { SocketContext } from '../../../gameController/socketCommunicator';
import styles from './OptionsModal.module.scss';

export const OptionsModal = ({ setOptionsVisible, playerId }) => {
    const { data: party } = useEngineModuleReader(GlobalStoreModule.PARTY);
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data

    const { socket } = useContext(SocketContext);

    const partyAction = (type) => {
        setOptionsVisible(false);
        socket?.emit(type, {
            characterId: playerId,
        });
    };

    const checkifActivePlayerIsLeader = () => {
        for (const key in party) {
            return party[key].leader === activeCharacterId;
        }
        return false;
    }

    const checkIfActivePlayerIsInParty = () => {
        for (const key in party) {
            const group = party[key];
            return group['membersIds'][activeCharacterId];
        }
    }

    const checkIfTargetIsInYourParty = (targetId) => {
        for (const key in party) {
            const group = party[key]['membersIds'];
            return group[activeCharacterId] && group[targetId];
        }
    }

    const leaveParty = () => {
        setOptionsVisible(false);
        socket?.emit(GroupClientMessages.LeaveParty);
    }

    return (
        <div className={styles.OptionsModal}>

            {checkifActivePlayerIsLeader() && playerId !== activeCharacterId && checkIfTargetIsInYourParty(playerId) ?
                <>
                    <div className={styles.Option} onClick={() => partyAction(GroupClientMessages.PromoteToLeader)}>Pass leader</div>
                    <div className={styles.Option} onClick={() => partyAction(GroupClientMessages.UninviteFromParty)}>Uninvite</div>
                </> : null}

            {checkIfActivePlayerIsInParty() && playerId === activeCharacterId ?
                <div className={styles.Option} onClick={() => leaveParty()}>Leave Party</div>
                : null}

            {playerId !== activeCharacterId && !checkIfTargetIsInYourParty(playerId) ?
                <>
                    <div className={styles.Option} onClick={() => partyAction(GroupClientMessages.InviteToParty)}>Invite to group</div>
                </> : null}

            <div className={styles.Option} onClick={() => setOptionsVisible(false)}>Cancel</div>
        </div>
    )
}