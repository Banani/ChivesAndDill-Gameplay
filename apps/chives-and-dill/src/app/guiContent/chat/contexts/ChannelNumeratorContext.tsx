import { useEnginePackageProvider } from 'apps/chives-and-dill/src/hooks';
import { find, findKey, forEach, pickBy } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

interface ChannelNumeratorContextMethods {
   channelNumerations: Record<string, string>;
   getNumberById: (channelId: string) => string;
}

export const ChannelNumeratorContext = React.createContext<ChannelNumeratorContextMethods>(null);

export const ChannelNumeratorContextProvider = ({ children }) => {
   const { chatChannels } = useEnginePackageProvider();
   const [channelNumerations, setChannelNumerations] = useState<Record<string, string>>({});

   useEffect(() => {
      const filteredChannel = pickBy(channelNumerations, (channelId) => chatChannels?.[channelId]);
      let i = 1;

      forEach(chatChannels, (_, channelId) => {
         if (find(filteredChannel, (alreadyExistingChannelId) => alreadyExistingChannelId === channelId)) {
            return;
         }

         while (filteredChannel[i]) {
            i++;
         }

         filteredChannel[i] = channelId;
      });

      setChannelNumerations(filteredChannel);
      //TODO: Last module update zrobic
   }, [Object.keys(chatChannels ?? {}).length]);

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
