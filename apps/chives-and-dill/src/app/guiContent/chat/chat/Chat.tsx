import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEnginePackageProvider } from 'apps/chives-and-dill/src/hooks';
import { map } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ChannelNumeratorContext } from '../contexts';
import styles from './Chat.module.scss';

export const Chat = () => {
   const { chatChannels, chatMessages, characters } = useEnginePackageProvider();
   const [activeChannelId, setActiveChannelId] = useState(null);
   const messageInput = useRef(null);
   const lastMessage = useRef(null);
   const [message, setMessage] = useState('');
   const keyBoardContext = useContext(KeyBoardContext);
   const channelNumeratorContext = useContext(ChannelNumeratorContext);
   const engineApiContext = useContext(EngineApiContext);
   const [lastKeyDown, setLastKeyDown] = useState(null);

   const modes = ['General', 'Combat Log', 'Global'];

   const mapChannels = modes.map((channel) => <div className={styles.channel}>{channel}</div>);

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

   const messageChanged = (e) => {
      const message = e.target.value;
      const command = message.match('/(.*?) ')?.[1];
      if (command) {
         if (!isNaN(command) && channelNumeratorContext.channelNumerations[command]) {
            setActiveChannelId(channelNumeratorContext.channelNumerations[command]);
            setMessage('');
         }
      } else {
         setMessage(message);
      }
   };

   const currentChannel = useMemo(() => {
      if (!chatChannels?.[activeChannelId]) {
         return 'Say: ';
      }
      const channel = chatChannels[activeChannelId];

      return `[${channelNumeratorContext.getNumberById(activeChannelId)}. ${channel.name}]`;
   }, [chatChannels, channelNumeratorContext]);

   useEffect(() => {
      if (lastKeyDown === 'Enter') {
         if (message !== '') {
            engineApiContext.sendChatMessage({ message, chatChannelId: activeChannelId });
         }
         messageInput.current.blur();
      }
   }, [lastKeyDown, activeChannelId]);

   useEffect(() => {
      lastMessage.current.scrollIntoView();
   }, [chatMessages]);

   return (
      <div className={styles.chatContainer}>
         <div className={styles.channelsContainer}>{mapChannels}</div>
         <div className={styles.chatContent}>
            <div className={styles.messagesHolder}>
               {map(chatMessages, (message) => (
                  <div className={styles.message}>
                     {`[${channelNumeratorContext.getNumberById(activeChannelId)}. ${chatChannels[message.chatChannelId].name}]
                  [${characters[message.authorId].name}]: ${message.message}`}
                  </div>
               ))}
               <div ref={lastMessage}></div>
            </div>
         </div>
         <div className={`${styles.messageHolder} ${document.activeElement === messageInput.current ? styles.active : ''}`}>
            {document.activeElement === messageInput.current && <div className={styles.channelName}>{currentChannel}</div>}
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
