import { GlobalModal, ModalsManagerContext } from 'apps/chives-and-dill/src/contexts/ModalsManagerContext';
import React, { useContext } from 'react';
import { ChatChannels } from './chatChannels/ChatChannels';

export const ChatManager = () => {
   const context = useContext(ModalsManagerContext);

   return <>{context.activeGlobalModal === GlobalModal.ChatChannelModal && <ChatChannels />}</>;
};
