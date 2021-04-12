import React from 'react';
import { Stage, Sprite } from '@inlet/react-pixi';
import { useSelector } from 'react-redux';
import { selectCharacters } from '../stores';
import _ from 'lodash';

const map = () => {
  const players = useSelector(selectCharacters);

  const renderPlayers = _.map(players, ({ image, location }, i) => (
    <Sprite key={i} image={'http://localhost:4200/assets/spritesheets/teemo.png'} x={location.x} y={location.y} />
  ));
    
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      options={{ backgroundColor: 0xeef1f5 }}
    >
      <Sprite image="http://localhost:4200/assets/maps/map1.png" x={0} y={0}>
        {renderPlayers}
      </Sprite>
    </Stage>
  );
};

export default map;
