import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Graphics } from '@inlet/react-pixi';
import { selectActiveSpellsCasts, selectActivePlayer, selectCharacters } from '../../stores';

export const CastBar = ({ activeSpellsCasts, players, activePlayerId }) => {
   const [channelSpellProgress, updateChannelSpellProgress] = useState(0);

   //  const activeSpellsCasts = useSelector(selectActiveSpellsCasts);
   //  const activePlayerId = useSelector(selectActivePlayer);
   //  const players = useSelector(selectCharacters);

   useEffect(() => {
      const interval = setInterval(() => {
         if (activeSpellsCasts[activePlayerId]) {
            const { spellCastTimeStamp, castTime } = activeSpellsCasts[players[activePlayerId].id];
            updateChannelSpellProgress((Date.now() - spellCastTimeStamp) / castTime);
         }
      }, 1000 / 60);

      updateChannelSpellProgress(0);
      return () => {
         clearInterval(interval);
      };
   }, [activeSpellsCasts[activePlayerId]]);

   const castBar = useCallback(
      (g) => {
         g.clear();
         g.beginFill(0xcfcfcf);
         g.drawRect(players[activePlayerId]?.location.x - 25, players[activePlayerId]?.location.y + 30, 50, 5);
         g.endFill();
         g.beginFill(0x2372fa);
         g.drawRect(players[activePlayerId]?.location.x - 25, players[activePlayerId]?.location.y + 30, (channelSpellProgress * 100) / 2, 5);
         g.endFill();
      },
      [players, activePlayerId, channelSpellProgress]
   );
   return channelSpellProgress ? <Graphics draw={castBar} /> : null;
};
