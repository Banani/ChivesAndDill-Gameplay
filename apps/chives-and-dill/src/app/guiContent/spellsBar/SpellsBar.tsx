import { GlobalStoreModule, PowerPointsTrack } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEngineModuleReader, useSpellDefinitionProvider } from 'apps/chives-and-dill/src/hooks';
import classnames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from './SpellsBar.module.scss';
import { SpellLoader } from './components/SpellLoader';
import disabledSpellImage from '../../../assets/spritesheets/backgrounds/spellBackground.png';

interface SpellsBarProps {
   lastUpdateTime: string;
   availableSpells: Record<string, boolean>;
   spellCastTime: Record<string, number>;
   characterPowerPoints: Record<string, PowerPointsTrack>;
   activeCharacterId: string;
}

export const SpellsBar = () => {
   const { data: availableSpells, lastUpdateTime: availableSpellsUpdateTime } = useEngineModuleReader(GlobalStoreModule.AVAILABLE_SPELLS);
   const { data: spellCastTime, lastUpdateTime: spellCastTimeUpdateTime } = useEngineModuleReader(GlobalStoreModule.SPELL_CAST_TIME);
   const { data: characterPowerPoints, lastUpdateTime: characterPowerPointsTime } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;

   return (
      <InternalSpellsBar
         lastUpdateTime={availableSpellsUpdateTime.toString() + spellCastTimeUpdateTime.toString() + characterPowerPointsTime.toString()}
         availableSpells={availableSpells as Record<string, boolean>}
         spellCastTime={spellCastTime as Record<string, number>}
         characterPowerPoints={characterPowerPoints as Record<string, PowerPointsTrack>}
         activeCharacterId={activeCharacterId}
      />
   );
};

const InternalSpellsBar: React.FunctionComponent<SpellsBarProps> = React.memo(
   ({ availableSpells, spellCastTime, characterPowerPoints, activeCharacterId }) => {
      const keyBoardContext = useContext(KeyBoardContext);
      const { spellDefinitions } = useSpellDefinitionProvider({ spellDefinitionIds: Object.keys(availableSpells) });
      const [clickedKey, setClickedKey] = useState('');

      const checkIfDisabled = useCallback(
         (powerCost) => {
            if (powerCost > characterPowerPoints[activeCharacterId]?.currentSpellPower) {
               return 'grayscale(70%)';
            }

            return '';
         },
         [characterPowerPoints[activeCharacterId]?.currentSpellPower]
      );

      useEffect(() => {
         keyBoardContext.addKeyHandler({
            id: 'activeSpellHightlight',
            matchRegex: '[0-9]',
            keydown: (key) => setClickedKey(key),
            keyup: () => setClickedKey(''),
         });

         return () => {
            keyBoardContext.removeKeyHandler('activeSpellHightlight');
         };
      }, []);

      const totalSpells = 12;
      const spellSlots = Array(totalSpells).fill(null);

      let index = 0;
      for (const spellId of Object.keys(availableSpells)) {
         spellSlots[index] = spellId;
         index++;
         if (index >= totalSpells) break;
      };

      return (
         <div className={styles.spellsBarContainer}>
            {spellSlots.map((spellId, counter) => {
                const activeSpell = spellDefinitions[spellId] ?? {};

               return (
                  <div key={counter} className={styles.spellContainer}>
                     <div className={styles.keyboardNumber}>{counter + 1}</div>
                     <div
                        className={classnames({
                           [styles.spellImage]: true,
                           [styles.spellHightlight]: (counter + 1).toString() == clickedKey,
                        })}
                        style={{
                           backgroundImage: spellId ? `url(${activeSpell.image})` : `url(${disabledSpellImage})`,
                           filter: spellId ? checkIfDisabled(activeSpell.spellPowerCost) : '',
                        }}
                     />
                     <div className={styles.spellHolder}>{spellId && <SpellLoader cooldown={activeSpell.cooldown} castTime={spellCastTime[spellId]} />}</div>
                     {spellId && (
                        <div className={styles.spellTooltip}>
                           <div>{activeSpell.name}</div>
                           <div className={styles.spellTooltipItem}>
                              <div>{activeSpell.spellPowerCost} Mana</div>
                              <div>{activeSpell.range} yd range</div>
                           </div>
                           <div className={styles.spellTooltipItem}>
                              <div>{activeSpell.channelTime ? `${activeSpell.channelTime / 1000} sec cast` : 'Instant cast'}</div>
                              <div>{'Cooldown: ' + activeSpell.cooldown / 1000 + ' sec'}</div>
                           </div>
                           <div className={styles.spellDesc}>{activeSpell.description}</div>
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      );
   },
   (oldProps, newProps) => oldProps.lastUpdateTime === newProps.lastUpdateTime
);
