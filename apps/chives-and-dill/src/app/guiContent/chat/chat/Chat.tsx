import { ChannelChatMessage, ChannelType, ChatChannel, ChatChannelClientActions, ChatMessage, GlobalStoreModule, QuoteChatMessage, RangeChatMessage, SystemChatMessage } from '@bananos/types';
import { ItemPreviewTooltip, TooltipShowMode } from 'apps/chives-and-dill/src/components/itemPreview/itemPreviewTooltip/ItemPreviewTooltip';
import { EngineContext } from 'apps/chives-and-dill/src/contexts/EngineApiContext';
import { ItemTemplateContext } from 'apps/chives-and-dill/src/contexts/ItemTemplateContext';
import { MenuContext } from 'apps/chives-and-dill/src/contexts/MenuContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { forEach, map } from 'lodash';
import React, { useContext, useEffect, useRef } from 'react';
import { GameControllerContext } from '../../../../contexts/GameController';
import { ChannelNumeratorContext } from '../contexts';
import styles from './Chat.module.scss';
import { MessageInput } from './components';

const RangeChannelsMessageMapper = {
    say: 'says: ',
    yell: 'yells: ',
};

interface ChatInternalProps {
    lastUpdateTime: string,
    characters: Record<string, any>,
    chatChannels: Record<string, ChatChannel>,
    chatMessages: Record<string, ChatMessage>,
    getChannelNumberById: (channelId: string) => string;
    recentData: Record<string, any>,
    activeCharacterId: string;
}

export const Chat = () => {
    const channelNumeratorContext = useContext(ChannelNumeratorContext);
    const { data: characters, lastUpdateTime: lastUpdateTimeCharacters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const { data: chatChannels, lastUpdateTime: lastUpdateTimeChatChannels } = useEngineModuleReader(GlobalStoreModule.CHAT_CHANNEL);
    const { data: chatMessages, lastUpdateTime: lastUpdateTimeChatMessages, recentData } = useEngineModuleReader(GlobalStoreModule.CHAT_MESSAGES);
    const activeCharacterId = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER)?.data?.activeCharacterId;

    return <ChatInternal
        lastUpdateTime={lastUpdateTimeCharacters + "#" + lastUpdateTimeChatChannels + "#" + lastUpdateTimeChatMessages}
        characters={characters}
        chatChannels={chatChannels as Record<string, ChatChannel>}
        chatMessages={chatMessages as Record<string, ChatMessage>}
        getChannelNumberById={channelNumeratorContext.getNumberById}
        recentData={recentData}
        activeCharacterId={activeCharacterId}
    />
}

const ChatInternal = React.memo(({
    characters,
    chatChannels,
    chatMessages,
    getChannelNumberById,
    recentData,
    activeCharacterId,
}: ChatInternalProps) => {
    const { itemTemplates, requestItemTemplate } = useContext(ItemTemplateContext);
    const menuContext = useContext(MenuContext);
    const { setActiveTarget } = useContext(GameControllerContext);
    const { callEngineAction } = useContext(EngineContext);

    const lastMessage = useRef(null);
    const modes = ['General', 'Combat Log', 'Global'];
    const mapChannels = modes.map((channel, id) => <div key={id} className={styles.channel}>{channel}</div>);
    const characterName = (character) => <span onClick={() => setActiveTarget(character.id)}>[{character.name}]</span>;

    const MessageMappers: Record<ChannelType, (message: ChatMessage) => JSX.Element> = {
        [ChannelType.Range]: (message: RangeChatMessage) => (
            <>
                {characterName(characters[message.authorId])}&nbsp;{`${RangeChannelsMessageMapper[message.chatChannelId]} ${message.message}`}
            </>
        ),
        [ChannelType.Quotes]: (message: QuoteChatMessage) => (
            <div>
                {characterName(characters[message.authorId])}
                {`: ${message.message}`}
            </div>
        ),
        [ChannelType.System]: (message: SystemChatMessage) => {
            if (message.itemTemplateId) {
                if (!itemTemplates[message.itemTemplateId]) {
                    return <span className={styles.itemReceiveMessage}>Loading...</span>
                }

                return <div>
                    <span className={styles.itemReceiveMessage}>You receive item: </span>
                    <ItemPreviewTooltip showMode={TooltipShowMode.Click} showMoney itemTemplate={itemTemplates[message.itemTemplateId]}>
                        [{itemTemplates[message.itemTemplateId].name}]
                    </ItemPreviewTooltip>
                </div >
            }

            return <div className={styles.systemMessage}>
                {message.message}
            </div>
        },
        [ChannelType.Private]: (message: ChannelChatMessage) => (
            <>
                <span
                    onContextMenu={(e) => {
                        e.preventDefault();
                        menuContext.setActions([
                            {
                                label: 'Leave Channel',
                                action: () => callEngineAction({
                                    type: ChatChannelClientActions.LeaveChatChannel,
                                    chatChannelId: message.chatChannelId
                                }),
                            },
                        ]);
                    }}
                >
                    {`[${getChannelNumberById(message.chatChannelId)}. ${chatChannels[message.chatChannelId].name}]`}
                </span>
                {characterName(characters[message.authorId])}
                {`: ${message.message}`}
            </>
        ),
    };

    useEffect(() => {
        forEach(chatMessages, message => {
            if (message.channelType === ChannelType.System && message.itemTemplateId && !itemTemplates[message.itemTemplateId]) {
                requestItemTemplate(message.itemTemplateId);
            }
        });
    }, [chatMessages]);

    useEffect(() => {
        forEach(recentData, (value, key) => {
            if (value.authorId === activeCharacterId) {
                lastMessage.current.scrollIntoView();
            }
        });
    }, [recentData]);

    return (
        <>
            <div className={styles.chatContainer}>
                <div className={styles.channelsContainer}>{mapChannels}</div>
                <div className={styles.chatContent}>
                    <div className={styles.messagesHolder}>
                        {map(chatMessages, (message, id) => (
                            <div key={id} className={styles.message}>{MessageMappers[message.channelType](message)}</div>
                        ))}
                        <div ref={lastMessage}></div>
                    </div>
                </div>
                <MessageInput chatChannels={chatChannels} />
            </div>
        </>
    );
},
    (oldProps, newProps) => oldProps.lastUpdateTime === newProps.lastUpdateTime
);