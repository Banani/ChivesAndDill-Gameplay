import { ChannelType, ChatChannel } from "@bananos/types";
import { EngineApiContext } from "apps/chives-and-dill/src/contexts/EngineApi";
import { KeyBoardContext } from "apps/chives-and-dill/src/contexts/KeyBoardContext";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ChannelNumeratorContext } from "../../contexts";
import styles from './MessageInput.module.scss';

interface CurrentChannel {
    id: string;
    channelType: ChannelType;
}

const rangeChannelCommands = ['say', 's', 'yell', 'y'];

const commandMapper = {
    say: 'say',
    s: 'say',
    yell: 'yell',
    y: 'yell',
};

const RangeChannelInputTest = {
    say: 'Say: ',
    yell: 'Yell: ',
};

interface MessageInputProps {
    chatChannels: Record<string, ChatChannel>,
}

export const MessageInput = ({ chatChannels }: MessageInputProps) => {
    const keyBoardContext = useContext(KeyBoardContext);
    const engineApiContext = useContext(EngineApiContext);
    const channelNumeratorContext = useContext(ChannelNumeratorContext);
    const [activeChannel, setActiveChannel] = useState<CurrentChannel>({ id: 'say', channelType: ChannelType.Range });
    const [message, setMessage] = useState('');
    const [lastKeyDown, setLastKeyDown] = useState(null);

    const messageInput = useRef(null);

    useEffect(() => {
        if (lastKeyDown === 'Enter') {
            if (message !== '') {
                engineApiContext.sendChatMessage({ message, chatChannelId: activeChannel.id, channelType: activeChannel.channelType });
            }
            messageInput.current.blur();
        }
    }, [lastKeyDown, activeChannel]);

    const currentChannelInputText = useMemo(() => {
        if (activeChannel.channelType === ChannelType.Range) {
            return RangeChannelInputTest[activeChannel.id];
        }

        if (activeChannel.channelType === ChannelType.Custom) {
            const channel = chatChannels[activeChannel.id];

            return `[${channelNumeratorContext.getNumberById(activeChannel.id)}. ${channel.name}]`;
        }

        return 'Not supported';
    }, [chatChannels, channelNumeratorContext]);

    const messageChanged = (e) => {
        const message = e.target.value;
        const command = message.match('/(.*?) ')?.[1];
        if (command) {
            if (!isNaN(command) && channelNumeratorContext.channelNumerations[command]) {
                setActiveChannel({ id: channelNumeratorContext.channelNumerations[command], channelType: ChannelType.Custom });
                setMessage('');
            } else if (rangeChannelCommands.indexOf(command) != -1) {
                setActiveChannel({ id: commandMapper[command], channelType: ChannelType.Range });
                setMessage('');
            }
        } else {
            setMessage(message);
        }
    };

    useEffect(() => {
        keyBoardContext.addKeyHandler({
            id: 'ChatEnter',
            matchRegex: 'Enter',
            keydown: () => messageInput.current.focus(),
        });

        return () => {
            keyBoardContext.removeKeyHandler('ChatBlockAll');
            keyBoardContext.removeKeyHandler('ChatEnter');
            keyBoardContext.removeKeyHandler('ChatEscape');
        };
    }, []);

    const cancelMessage = useCallback(() => {
        keyBoardContext.removeKeyHandler('ChatBlockAll');
        keyBoardContext.removeKeyHandler('ChatEscape');
        setMessage('');
        setLastKeyDown(null);
    }, []);

    return (
        <div className={`${styles.messageHolder} ${document.activeElement === messageInput.current ? styles.active : ''}`}>
            {document.activeElement === messageInput.current && <div className={styles.channelName}>{currentChannelInputText}</div>}
            <input
                ref={messageInput}
                className={styles.chatInput}
                onChange={messageChanged}
                value={message}
                onFocus={() => {
                    keyBoardContext.addKeyHandler({ id: 'ChatBlockAll', matchRegex: '.*', keydown: setLastKeyDown });
                    keyBoardContext.addKeyHandler({
                        id: 'ChatEscape',
                        matchRegex: 'Escape',
                        keydown: () => messageInput.current.blur(),
                    });
                }}
                onBlur={cancelMessage}
            />
        </div>)
}