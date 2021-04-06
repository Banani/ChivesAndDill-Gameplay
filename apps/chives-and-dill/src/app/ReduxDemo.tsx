import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePlayerPosition, selectCharacters } from '../stores';

export const ReduxDemo = () => {
  const players = useSelector(selectCharacters);
  const dispatch = useDispatch();

  return (
    <>
      <pre>{JSON.stringify(players)}</pre>
      <button
        onClick={() =>
          dispatch(
            changePlayerPosition({
              selectedPlayerId: '1',
              newLocation: { x: Math.random(), y: Math.random() },
            })
          )
        }
      >
        Random
      </button>
    </>
  );
};
