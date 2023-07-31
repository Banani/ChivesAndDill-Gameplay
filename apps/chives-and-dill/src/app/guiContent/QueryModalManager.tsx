import { GlobalStoreModule, GroupClientMessages } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React, { useContext } from 'react';
import { QueryModal } from './components/queryModal/QueryModal';
import _ from 'lodash';
import { SocketContext } from '../gameController/socketContext';

export const QueryModalManager = () => {
  const { data: partyInvitation } = useEngineModuleReader(GlobalStoreModule.PARTY_INVITATION);
  const { data: character } = useEngineModuleReader(GlobalStoreModule.CHARACTER);

  const context = useContext(SocketContext);
  const { socket } = context;

  const handleInvite = (type) => {
    socket?.emit(type);
    partyInvites = [];
  }

  let partyInvites = _.map(partyInvitation, (inviteTarget, inviter) => {
    const InviterName = character[inviter].name
    return (
      <QueryModal
        accept={() => handleInvite(GroupClientMessages.AcceptInvite)}
        decline={() => handleInvite(GroupClientMessages.DeclineInvite)}
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