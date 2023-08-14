import { GlobalStoreModule, GroupClientActions } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useContext } from 'react';
import { EngineContext } from '../../contexts/EngineApiContext';
import { QueryModal } from './components/queryModal/QueryModal';

export const QueryModalManager = () => {
    const { data: partyInvitation } = useEngineModuleReader(GlobalStoreModule.PARTY_INVITATION);
    const { data: character } = useEngineModuleReader(GlobalStoreModule.CHARACTER);

    const { callEngineAction } = useContext(EngineContext);

    const acceptInvite = () => {
        callEngineAction({ type: GroupClientActions.AcceptInvite });
        partyInvites = [];
    }

    const declineInvite = () => {
        callEngineAction({ type: GroupClientActions.DeclineInvite });
        partyInvites = [];
    }

    let partyInvites = _.map(partyInvitation, (inviteTarget, inviter) => {
        const InviterName = character[inviter].name
        return (
            <QueryModal
                accept={acceptInvite}
                decline={declineInvite}
                text={`${InviterName} invites you to join a group.`}
            />
        )
    })

    return (
        <>
            {partyInvites}
        </>
    )
}