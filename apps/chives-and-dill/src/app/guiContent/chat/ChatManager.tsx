import { GlobalModal, ModalsManagerContext } from 'apps/chives-and-dill/src/contexts/ModalsManagerContext';
import React, { useContext } from 'react';
import { Chat } from './chat/Chat';
import { ChatChannels } from './chatChannels/ChatChannels';
import { ChannelNumeratorContextProvider } from './contexts';

export const ChatManager = () => {
   const context = useContext(ModalsManagerContext);

   return <ChannelNumeratorContextProvider>
      {context.activeGlobalModal === GlobalModal.ChatChannelModal && <ChatChannels />}
      <Chat />
   </ChannelNumeratorContextProvider>;
};
