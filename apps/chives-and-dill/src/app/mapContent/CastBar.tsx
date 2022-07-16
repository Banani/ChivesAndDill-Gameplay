import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Graphics } from '@inlet/react-pixi';
import { getEngineState } from '../../stores';

export const CastBar = ({ playerId, castBarData }) => {

   const [channelSpellProgress, updateChannelSpellProgress] = useState(0);

   const engineState = useSelector(getEngineState);

   useEffect(() => {
      const interval = setInterval(() => {
         if (castBarData) {
            const { castingStartedTimestamp, timeToCast } = castBarData;
            updateChannelSpellProgress((Date.now() - castingStartedTimestamp) / timeToCast);
         }
      }, 1000 / 60);

      updateChannelSpellProgress(0);
      return () => {
         clearInterval(interval);
      };
   }, [castBarData, playerId]);

   const castBar = useCallback(
      (g) => {
         g.clear();
         g.beginFill(0xcfcfcf);
         g.drawRect(engineState?.characterMovements.data[playerId].location.x + 20, engineState?.characterMovements.data[playerId].location.y + 80, 50, 5);
         g.endFill();
         g.beginFill(0x2372fa);
         g.drawRect(
            engineState?.characterMovements.data[playerId].location.x + 20,
            engineState?.characterMovements.data[playerId].location.y + 80,
            (channelSpellProgress * 100) / 2,
            5
         );
         g.endFill();
      },
      [playerId, channelSpellProgress, engineState.characterMovements]
   );
   return <Graphics draw={castBar} />;
};
