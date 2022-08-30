import { ChannelChatMessage, ChannelType, ChatMessage, GlobalStoreModule, QuoteChatMessage, RangeChatMessage } from '@bananos/types';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { MenuContext } from 'apps/chives-and-dill/src/contexts/MenuContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { setActiveTarget } from 'apps/chives-and-dill/src/stores';
import { map } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChannelNumeratorContext } from '../contexts';
import styles from './Chat.module.scss';

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

const RangeChannelsMessageMapper = {
   say: 'says: ',
   yell: 'yells: ',
};

const RangeChannelInputTest = {
   say: 'Say: ',
   yell: 'Yell: ',
};

export const Chat = () => {
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
   const { data: chatChannels } = useEngineModuleReader(GlobalStoreModule.CHAT_CHANNEL);
   const { data: chatMessages } = useEngineModuleReader(GlobalStoreModule.CHAT_MESSAGES);

   const keyBoardContext = useContext(KeyBoardContext);
   const channelNumeratorContext = useContext(ChannelNumeratorContext);
   const engineApiContext = useContext(EngineApiContext);
   const menuContext = useContext(MenuContext);
   const dispatch = useDispatch();

   const [activeChannel, setActiveChannel] = useState<CurrentChannel>({ id: 'say', channelType: ChannelType.Range });
   const [message, setMessage] = useState('');
   const [lastKeyDown, setLastKeyDown] = useState(null);

   const messageInput = useRef(null);
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
               {`[${channelNumeratorContext.getNumberById(activeChannel.id)}. ${chatChannels[message.chatChannelId].name}]`}
            </span>
            {characterName(characters[message.authorId])}
            {`: ${message.message}`}
         </>
      ),
   };

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
      if (lastKeyDown === 'Enter') {
         if (message !== '') {
            engineApiContext.sendChatMessage({ message, chatChannelId: activeChannel.id, channelType: activeChannel.channelType });
         }
         messageInput.current.blur();
      }
   }, [lastKeyDown, activeChannel]);

   const cancelMessage = useCallback(() => {
      keyBoardContext.removeKeyHandler('ChatBlockAll');
      keyBoardContext.removeKeyHandler('ChatEscape');
      setMessage('');
      setLastKeyDown(null);
   }, []);

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

   useEffect(() => {
      lastMessage.current.scrollIntoView();
   }, [chatMessages]);

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
         </div>
      </div>
   );
};
