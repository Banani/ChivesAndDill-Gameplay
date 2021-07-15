import React from 'react';
import "./PlayerIcon.css";

export const PlayerIcon = ({ player }) => {

  const { name, maxHp, currentHp } = player;

  return (
    <div className="PlayerIconContainer">
      <div className="playerAvatar"></div>
      <div className="barsContainer">
        <div className="name-bar">{name}</div>
        <div className="bar hp-bar">
          <div className="bar-text">{currentHp + "/" + maxHp}</div>
        </div>
        <div className="bar mana-bar">
          <div className="bar-text">{currentHp + "/" + maxHp}</div>
        </div>
      </div>
    </div>
  )
}