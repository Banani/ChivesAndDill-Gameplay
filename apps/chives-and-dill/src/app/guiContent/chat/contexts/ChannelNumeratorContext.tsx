import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _, { find, findKey, pickBy } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

interface ChannelNumeratorContextMethods {
   channelNumerations: Record<string, string>;
   getNumberById: (channelId: string) => string;
}

export const ChannelNumeratorContext = React.createContext<ChannelNumeratorContextMethods>(null);

export const ChannelNumeratorContextProvider = ({ children }) => {
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: chatChannels } = useEngineModuleReader(GlobalStoreModule.CHAT_CHANNEL);
   const [channelNumerations, setChannelNumerations] = useState<Record<string, string>>({});

   useEffect(() => {
      const filteredChannel = pickBy(channelNumerations, (channelId) => chatChannels?.[channelId] && chatChannels[channelId].membersIds[activeCharacterId]);
      let i = 1;

      _.forEach(chatChannels, (channel, channelId) => {
         if (find(filteredChannel, (alreadyExistingChannelId) => alreadyExistingChannelId === channelId)) {
            return;
         }

         if (!channel.membersIds[activeCharacterId]) {
            return;
         }

         while (filteredChannel[i]) {
            i++;
         }

         filteredChannel[i] = channelId;
      });

      setChannelNumerations(filteredChannel);
   }, [chatChannels]);

   const getNumberById = useCallback(
      (channelId: string) => findKey(channelNumerations, (currentChannelId, number) => currentChannelId === channelId),
      [channelNumerations]
   );

   return (
      <ChannelNumeratorContext.Provider
         value={{
            channelNumerations,
            getNumberById,
         }}
      >
         {children}
      </ChannelNumeratorContext.Provider>
   );
};
