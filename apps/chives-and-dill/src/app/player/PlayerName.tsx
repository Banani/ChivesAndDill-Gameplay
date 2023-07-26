import React from 'react';
import { Text } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

export const PlayerName = ({ player, charactersMovements, h }) => {

  return (
    <Text
      text={player.name}
      anchor={[0.5, 1.3]}
      x={charactersMovements[player.id].location.x}
      y={charactersMovements[player.id].location.y - h / 1.5}
      zIndex={2}
      style={
        new PIXI.TextStyle({
          fontSize: 15,
          fill: 'green',
          fontWeight: 'bold',
          lineJoin: 'round',
          strokeThickness: 4,
          fontFamily: 'Septimus',
        })
      }
    />
  )
}