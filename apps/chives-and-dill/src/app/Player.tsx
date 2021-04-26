import React, { useState, useEffect, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Graphics, Sprite, Text } from '@inlet/react-pixi';
import _ from 'lodash';

const Player = ({ player, characterViewsSettings }) => {
  const [i, setI] = useState(0);
  const [playerSheet, setPlayerSheet] = useState({});
  const [characterDirection, setCharacterDirection] = useState('standingDown');
  const [isCharacterMoving, setIsCharacterMoving] = useState(false);

  const playerSprite = characterViewsSettings[player.sprites];
  let sheet = PIXI.BaseTexture.from(`../assets${characterViewsSettings[player.sprites].image}`);
  let w = playerSprite.spriteWidth;
  let h = playerSprite.spriteHeight;

  const getPlayerSheets = () => {
    let newPlayerSheets = {
      movementDown: [],
      movementUp: [],
      movementRight: [],
      movementLeft: [],
      standingUp: [],
      standingDown: [],
      standingRight: [],
      standingLeft: [],
    };

    _.forOwn(newPlayerSheets, function (value, key) {
      for (let i = 0; i < playerSprite[key].spriteAmount; i++) {
        newPlayerSheets[key][i] = new PIXI.Texture(
          sheet,
          new PIXI.Rectangle(
            i * w + playerSprite[key].xOffSet,
            playerSprite[key].yOffSet,
            w,
            h
          )
        );
      }
    });
    setPlayerSheet(newPlayerSheets);
  };

  const getDirection = (direction) => {
    if (!isCharacterMoving) {
      if (direction === 0) {
        setCharacterDirection('standingUp');
      }
      if (direction === 1) {
        setCharacterDirection('standingDown');
      }
      if (direction === 2) {
        setCharacterDirection('standingLeft');
      }
      if (direction === 3) {
        setCharacterDirection('standingRight');
      }
    } else {
      if (direction === 0) {
        setCharacterDirection('movementUp');
      }
      if (direction === 1) {
        setCharacterDirection('movementDown');
      }
      if (direction === 2) {
        setCharacterDirection('movementLeft');
      }
      if (direction === 3) {
        setCharacterDirection('movementRight');
      }
    }
  };

  useEffect(() => {
    setInterval(() => {
      setI((zxc) => zxc + 1);
    }, 20);
  }, []);

  useEffect(() => {
    getPlayerSheets();
  }, [])

  useEffect(() => {
    getDirection(player.direction);
  }, [player.direction, isCharacterMoving])

  useEffect(() => {
    setIsCharacterMoving(player.isInMove);
  }, [player.isInMove])
  let maxHP = 50
  let currentHealth = 50
  const hpBar = useCallback((g) => {
    g.clear();
    g.beginFill(0xff0000);
    g.drawRect(player?.location.x - maxHP / 2, player?.location.y-h/1.5, maxHP, 5);
    g.endFill();
    g.beginFill(0x00ff00);
    g.drawRect(player?.location.x - maxHP / 2, player?.location.y-h/1.5, currentHealth, 5);
    g.endFill();
  }, [player]);
  
  return (
    <>
      <Text
        text={player.name}
        anchor={[0.5, 3.25]}
        x={player?.location.x}
        y={player?.location.y}
        style={
          new PIXI.TextStyle({
            fontSize: 15
          })}
          
      />
      <Graphics draw={hpBar} />
      {playerSheet['movementDown'] && <Sprite key={0} texture={playerSheet[characterDirection][i % 8]} x={player?.location.x - (w / 2)} y={player?.location.y - (h / 2)} />}
    </>
  )
}

export default Player;
