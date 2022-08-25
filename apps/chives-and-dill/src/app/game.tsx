import { GlobalStoreModule } from '@bananos/types';
import React from 'react';
import { ModalsManagerContextProvider } from '../contexts/ModalsManagerContext';
import { useEngineModuleReader } from '../hooks/useEngineModuleReader';
import GameController from './gameController/gameController';
import { ClassesModal } from './guiContent/classesModal/classesModal';
import Map from './map';

export function Game() {
   const activeCharacterId = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER)?.data?.activeCharacterId;

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
