import { useEnginePackageProvider } from 'apps/chives-and-dill/src/hooks';
import React from 'react';
import { MapManager } from './MapManager';

export const MapWrapper = () => {
   const { characterMovements, activeCharacterId, mapSchema } = useEnginePackageProvider();

   return <MapManager mapSchema={mapSchema} location={characterMovements[activeCharacterId]?.location} />;
};
