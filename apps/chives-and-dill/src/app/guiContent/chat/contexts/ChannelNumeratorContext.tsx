import { useEnginePackageProvider } from 'apps/chives-and-dill/src/hooks';
import { find, forEach, pickBy } from 'lodash';
import React, { useEffect, useState } from 'react';

interface ChannelNumeratorContextMethods {
   channelNumerations: Record<string,string>;
}

export const ChannelNumeratorContext = React.createContext<ChannelNumeratorContextMethods>(null);

export const ChannelNumeratorContextProvider = ({ children }) => {
   const { chatChannels } = useEnginePackageProvider();
   const [channelNumerations, setChannelNumerations] = useState<Record<string, string>>({});

   useEffect(() => {
      const filteredChannel = pickBy(channelNumerations, channelId => chatChannels?.[channelId]);
      let i = 1;

      forEach(chatChannels, (_, channelId) => {
         if(find(filteredChannel, alreadyExistingChannelId => alreadyExistingChannelId === channelId)) {
            return;
         }

         while(filteredChannel[i]) {
            i++;
         }

         filteredChannel[i] = channelId;
      })

      setChannelNumerations(filteredChannel);
      //TODO: Last module update zrobic
   }, [Object.keys(chatChannels ?? {}).length]);

   return (
      <ChannelNumeratorContext.Provider
         value={{
            channelNumerations
         }}
      >
         {children}
      </ChannelNumeratorContext.Provider>
   );
};
