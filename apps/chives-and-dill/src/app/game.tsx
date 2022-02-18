import React from 'react';
import GameController from './gameController/gameController';
import { ClassesModal } from './player/classesModal/classesModal';
import Map from './map';
import { useSelector } from 'react-redux';
import { selectActiveCharacterId } from '../stores';

export function Game() {
   const activeCharacterId = useSelector(selectActiveCharacterId);

   return (
      <>
         {activeCharacterId === null && <ClassesModal />}
         {activeCharacterId !== null && (
            <GameController>
               <Map />
            </GameController>
         )}
      </>
   );
}
