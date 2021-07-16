import React from 'react';
import "./PlayerIcon.css";

export const PlayerIcon = ({ player }) => {

  const { name, maxHp, currentHp } = player;

  return (
    <div className="PlayerIconContainer">
      <div className="playerAvatar"></div>
      <div className="playerLvl">69</div>
      <div className="barsContainer">
        <div className="name-bar">{name}</div>
        <div className="bar">
          <div className="bar-text">{currentHp + "/" + maxHp}</div>
          <div className="hp-color" style={{ width: (currentHp / maxHp) * 100 + "%" }}></div>
        </div>
        <div className="bar">
          <div className="bar-text">{100 + "/" + 100}</div>
          <div className="mana-color"></div>
        </div>
      </div>
    </div>
  )
}