import React, { useEffect, useCallback, useState } from 'react';
import { Graphics } from '@inlet/react-pixi';

export const CastBar = React.memo<{ playerId: any; castBarData: any; location: { x: number; y: number } }>(
   ({ playerId, castBarData, location }) => {

      const [channelSpellProgress, updateChannelSpellProgress] = useState(0);

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
            g.drawRect(location.x + 20, location.y + 80, 50, 5);
            g.endFill();
            g.beginFill(0x2372fa);
            g.drawRect(
               location.x + 20,
               location.y + 80,
               (channelSpellProgress * 100) / 2,
               5
            );
            g.endFill();
         },
         [playerId, channelSpellProgress, location]
      );
      return <Graphics draw={castBar} />;
   },
   (old, newProps) =>
      old.location.x === newProps.location.x &&
      old.location.y === newProps.location.y
);
