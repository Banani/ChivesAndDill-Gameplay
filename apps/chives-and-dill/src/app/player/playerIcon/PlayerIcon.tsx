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
        <div className="bar hp-bar" style={{ width: (currentHp / maxHp) * 100 + "%" }}>
          <div className="bar-text">{currentHp + "/" + maxHp}</div>
        </div>
        <div className="bar mana-bar">
          <div className="bar-text">{100 + "/" + 100}</div>
        </div>
      </div>
    </div>
  )
}