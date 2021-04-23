import React, { useState, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { Sprite, Text } from '@inlet/react-pixi';
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

  return (
    <>
      <Text
        text={player.name}
        x={player?.location.x}
        y={player?.location.y - h / 2}
        anchor={{ x: 0.5, y: 1.1 }}

        style={

          new PIXI.TextStyle({
            fontSize: 20
          })}
      />
      {playerSheet['movementDown'] && <Sprite key={0} width={w} height={h} texture={playerSheet[characterDirection][i % 8]} x={player?.location.x - (w / 2)} y={player?.location.y - (h / 2)} />}
    </>
  )
}

export default Player;
