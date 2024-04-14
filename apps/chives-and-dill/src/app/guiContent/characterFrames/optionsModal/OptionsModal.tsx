import { GlobalStoreModule, GroupClientActions } from '@bananos/types';
import { EngineContext } from 'apps/chives-and-dill/src/contexts/EngineApiContext';
import { GameControllerContext } from 'apps/chives-and-dill/src/contexts/GameController';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React, { useContext, useEffect, useRef } from 'react';
import styles from './OptionsModal.module.scss';

export const OptionsModal = ({ optionsVisible, setOptionsVisible, playerId }) => {
    const { data: party } = useEngineModuleReader(GlobalStoreModule.PARTY);
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data

    const { callEngineAction } = useContext(EngineContext);

    const ref = useRef<HTMLDivElement>(null);

    const keyBoardContext = useContext(KeyBoardContext);
    const { setActiveTarget } = useContext(GameControllerContext);

    const partyAction = (type) => {
        setOptionsVisible(false);
        callEngineAction({
            type,
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
        callEngineAction({ type: GroupClientActions.LeaveParty });
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setOptionsVisible(false);
        }
    };

    const handleEscape = () => {
        if (optionsVisible) {
            setOptionsVisible(false);
        } else {
            setActiveTarget(null);
        }
    };

    useEffect(() => {
        keyBoardContext.addKeyHandler({
            id: 'ExitOptions',
            matchRegex: 'Escape',
            keydown: () => handleEscape(),
        });

        return () => keyBoardContext.removeKeyHandler('ExitOptions');

    }, [optionsVisible]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
        };
    }, []);

    return (
        <div ref={ref} className={styles.OptionsModal}>

            {checkifActivePlayerIsLeader() && playerId !== activeCharacterId && checkIfTargetIsInYourParty(playerId) ?
                <>
                    <div className={styles.Option} onClick={() => partyAction(GroupClientActions.PromoteToLeader)}>Pass leader</div>
                    <div className={styles.Option} onClick={() => partyAction(GroupClientActions.UninviteFromParty)}>Uninvite</div>
                </> : null}

            {checkIfActivePlayerIsInParty() && playerId === activeCharacterId ?
                <div className={styles.Option} onClick={() => leaveParty()}>Leave Party</div>
                : null}

            {playerId !== activeCharacterId && !checkIfTargetIsInYourParty(playerId) ?
                <>
                    <div className={styles.Option} onClick={() => partyAction(GroupClientActions.InviteToParty)}>Invite to group</div>
                </> : null}

            <div className={styles.Option} onClick={() => setOptionsVisible(false)}>Cancel</div>
        </div>
    )
}