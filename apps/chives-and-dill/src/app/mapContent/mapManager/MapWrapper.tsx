import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React from 'react';
import { MapManager } from './MapManager';

export const MapWrapper = () => {
   const activeCharacterId = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER)?.data?.activeCharacterId;
   const { data: mapSchema } = useEngineModuleReader(GlobalStoreModule.MAP_SCHEMA);
   const { data: characterMovements } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);

   return <MapManager mapSchema={mapSchema} location={characterMovements[activeCharacterId as any]?.location} />;
};
