import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Graphics } from '@inlet/react-pixi';
import { selectCharacters, getEngineState } from '../../stores';
import { selectSpellChannels } from '../../stores';

export const CastBar = ({ playerId }) => {
   const [channelSpellProgress, updateChannelSpellProgress] = useState(0);

   const players = useSelector(selectCharacters);
   const engineState = useSelector(getEngineState);
   const activeSpellChannel = useSelector(selectSpellChannels);
   console.log(activeSpellChannel)
   useEffect(() => {
      console.log(activeSpellChannel)
   }, [activeSpellChannel]);

   // useEffect(() => {
   //    const interval = setInterval(() => {
   //       if (activeSpellsCasts[playerId]) {
   //          const { spellCastTimeStamp, castTime } = activeSpellsCasts[players[playerId].id];
   //          updateChannelSpellProgress((Date.now() - spellCastTimeStamp) / castTime);
   //       }
   //    }, 1000 / 60);

   //    updateChannelSpellProgress(0);
   //    return () => {
   //       clearInterval(interval);
   //    };
   // }, [activeSpellsCasts, playerId]);

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
   return channelSpellProgress ? <Graphics draw={castBar} /> : null;
};
