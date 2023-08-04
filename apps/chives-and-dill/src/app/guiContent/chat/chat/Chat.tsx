import { ChannelChatMessage, ChannelType, ChatChannel, ChatMessage, GlobalStoreModule, QuoteChatMessage, RangeChatMessage, SystemChatMessage } from '@bananos/types';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { ItemTemplateContext } from 'apps/chives-and-dill/src/contexts/ItemTemplateContext';
import { MenuContext } from 'apps/chives-and-dill/src/contexts/MenuContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { setActiveTarget } from 'apps/chives-and-dill/src/stores';
import { map } from 'lodash';
import React, { useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
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
}

export const Chat = () => {
    const channelNumeratorContext = useContext(ChannelNumeratorContext);
    const { data: characters, lastUpdateTime: lastUpdateTimeCharacters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const { data: chatChannels, lastUpdateTime: lastUpdateTimeChatChannels } = useEngineModuleReader(GlobalStoreModule.CHAT_CHANNEL);
    const { data: chatMessages, lastUpdateTime: lastUpdateTimeChatMessages } = useEngineModuleReader(GlobalStoreModule.CHAT_MESSAGES);

    return <ChatInternal
        lastUpdateTime={lastUpdateTimeCharacters + "#" + lastUpdateTimeChatChannels + "#" + lastUpdateTimeChatMessages}
        characters={characters}
        chatChannels={chatChannels as Record<string, ChatChannel>}
        chatMessages={chatMessages as Record<string, ChatMessage>}
        getChannelNumberById={channelNumeratorContext.getNumberById}
    />
}

const ChatInternal = React.memo(({ characters, chatChannels, chatMessages, getChannelNumberById, lastUpdateTime }: ChatInternalProps) => {
    const { itemTemplates, requestItemTemplate } = useContext(ItemTemplateContext);

    const engineApiContext = useContext(EngineApiContext);
    const menuContext = useContext(MenuContext);
    const dispatch = useDispatch();
    const lastMessage = useRef(null);

    const modes = ['General', 'Combat Log', 'Global'];

    const mapChannels = modes.map((channel) => <div className={styles.channel}>{channel}</div>);

    const characterName = (character) => <span onClick={() => dispatch(setActiveTarget({ characterId: character.id }))}>[{character.name}]</span>;

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
            if (message.itemId) {
                if (!itemTemplates[message.itemId]) {
                    requestItemTemplate(message.itemId);
                }
                if (!itemTemplates[message.itemId]) {
                    return <span className={styles.itemReceiveMessage}>Loading...</span>
                }

                return <div>
                    <span className={styles.itemReceiveMessage}>You receive item: </span>[{itemTemplates[message.itemId].name}]
                </div>
            }

            return <div className={styles.systemMessage}>
                {message.message}
            </div>
        },
        [ChannelType.Custom]: (message: ChannelChatMessage) => (
            <>
                <span
                    onContextMenu={(e) => {
                        e.preventDefault();
                        menuContext.setActions([
                            {
                                label: 'Leave Channel',
                                action: () => engineApiContext.leaveChatChannel({ chatChannelId: message.chatChannelId }),
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
        lastMessage.current.scrollIntoView();
    }, [chatMessages, lastUpdateTime]);

    return (
        <div className={styles.chatContainer}>
            <div className={styles.channelsContainer}>{mapChannels}</div>
            <div className={styles.chatContent}>
                <div className={styles.messagesHolder}>
                    {map(chatMessages, (message) => (
                        <div className={styles.message}>{MessageMappers[message.channelType](message)}</div>
                    ))}
                    <div ref={lastMessage}></div>
                </div>
            </div>
            <MessageInput chatChannels={chatChannels} />
        </div>
    );
},
    (oldProps, newProps) => oldProps.lastUpdateTime === newProps.lastUpdateTime
);