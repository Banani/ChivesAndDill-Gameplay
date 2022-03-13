import React from "react";
import styles from "./Chat.module.scss";

export const Chat = () => {

  const channels = ['General', 'Combat Log', 'Global'];

  const mapChannels = channels.map(channel => (
    <div className={styles.channel}>{channel}</div>
  ))


  return (
    <div className={styles.chatContainer}>
      <div className={styles.channelsContainer}>
        {mapChannels}
      </div>
      <div className={styles.chatContent}></div>
      <input className={styles.chatInput}></input>
    </div>
  )
}