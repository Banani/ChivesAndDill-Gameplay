import { KeyBoardContext } from "apps/chives-and-dill/src/contexts/KeyBoardContext";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./Chat.module.scss";

export const Chat = () => {
  const messageInput = useRef(null);
  const [message, setMessage] = useState("");
  const keyBoardContext = useContext(KeyBoardContext);

  const modes = ['General', 'Combat Log', 'Global'];

  const mapChannels = modes.map(channel => (
    <div className={styles.channel}>{channel}</div>
  ))

  const cancelMessage = useCallback(() => {
    setMessage("");
    keyBoardContext.removeKeyHandler("InputDialogBlockAll"); 
    keyBoardContext.removeKeyHandler("ChatEscape");
  }, []);
  
  useEffect(() => {
    keyBoardContext.addKeyHandler({
      id: 'ChatEnter',
      matchRegex: 'Enter',
      keydown: () =>messageInput.current.focus(),
   });

    return () => {
      keyBoardContext.removeKeyHandler("InputDialogBlockAll");
      keyBoardContext.removeKeyHandler('ChatEnter');
      keyBoardContext.removeKeyHandler('ChatEscape');
    }
 }, []);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.channelsContainer}>
        {mapChannels}
      </div>
      <div className={styles.chatContent}></div>
      <input 
        ref={messageInput} 
        className={styles.chatInput} 
        onChange={e => setMessage(e.target.value)}
        value={message}
        onFocus={() => {
          keyBoardContext.addKeyHandler({ id: "InputDialogBlockAll", matchRegex: ".*"})
          keyBoardContext.addKeyHandler({
            id: 'ChatEscape',
            matchRegex: 'Escape',
            keydown: () => messageInput.current.blur(),
         });
        }}
        onBlur={cancelMessage}
        />
    </div>
  )
}