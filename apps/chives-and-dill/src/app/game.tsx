import React from 'react';
import { ModalsManagerContextProvider } from '../contexts/ModalsManagerContext';
import { useEnginePackageProvider } from '../hooks';
import GameController from './gameController/gameController';
import { ClassesModal } from './guiContent/classesModal/classesModal';
import Map from './map';

export function Game() {
   const { activeCharacterId } = useEnginePackageProvider();

   return (
      <>
         {!activeCharacterId && <ClassesModal />}
         {activeCharacterId && (
            <ModalsManagerContextProvider>
               <GameController>
                  <Map />
               </GameController>
            </ModalsManagerContextProvider>
         )}
      </>
   );
}
