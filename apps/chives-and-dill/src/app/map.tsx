import React, { useEffect } from 'react';
import { Stage, Sprite } from '@inlet/react-pixi';
import { useDispatch, useSelector } from 'react-redux';
import { initializePlayers, selectCharacters } from '../stores';
import { io } from 'socket.io-client';
import _ from 'lodash';

import { EngineEvents } from '@bananos/types';

const map = () => {
  const players = useSelector(selectCharacters);
  const dispatch = useDispatch();

  const renderPlayers = _.map(players, ({ image, location }, i) => (
    <Sprite key={i} image={image} x={location.x} y={location.y} />
  ));

  useEffect(() => {
    const URL = 'http://localhost:3000';
    const socket = io(URL, { autoConnect: true });

    socket.on(EngineEvents.Inicialization, ({ players }) => {
      dispatch(initializePlayers({ characters: players }));
    });

    socket.on(EngineEvents.UserConnected, ({ player }) => {
      console.log('user_connected', player);
    });

    socket.on(EngineEvents.UserDisconnected, ({ userId }) => {
      console.log('user_disconnected', userId);
    });
  }, []);

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
