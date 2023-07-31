import { ChatChannel, GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _, { find, findKey, pickBy } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';

interface ChannelNumeratorContextMethods {
    channelNumerations: Record<string, string>;
    getNumberById: (channelId: string) => string;
    setActiveCharacterId: (activeCharacterId: string) => void;
    setChatChannels: (chatChannels: Record<string, ChatChannel>) => void;
}

export const ChannelNumeratorContext = React.createContext<ChannelNumeratorContextMethods>(null);

export const ChannelNumeratorContextProvider = ({ children }) => {
    const [activeCharacterId, setActiveCharacterId] = useState('');
    const [chatChannels, setChatChannels] = useState<Record<string, ChatChannel>>({});

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
                setChatChannels,
                setActiveCharacterId
            }}
        >
            <ChannelNumeratorContextDataSetter />
            {children}
        </ChannelNumeratorContext.Provider>
    );
};

const ChannelNumeratorContextDataSetter = () => {
    const channelNumeratorContext = useContext(ChannelNumeratorContext);
    const { activeCharacterId, lastUpdateTime: activeCharacterLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
    const { data: chatChannels, lastUpdateTime: chatChannelsLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.CHAT_CHANNEL);

    useEffect(() => {
        channelNumeratorContext.setActiveCharacterId(activeCharacterId);
    }, [activeCharacterLastUpdateTime]);

    useEffect(() => {
        channelNumeratorContext.setChatChannels(chatChannels as Record<string, ChatChannel>);
    }, [chatChannelsLastUpdateTime]);

    return null;
}