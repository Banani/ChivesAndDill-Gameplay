import { GlobalStoreModule, Player, PowerPointsTrack } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEngineModuleReader, useSpellDefinitionProvider } from 'apps/chives-and-dill/src/hooks';
import classnames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from './SpellsBar.module.scss';
import { SpellLoader } from './components/SpellLoader';

interface SpellsBarProps {
    lastUpdateTime: string;
    availableSpells: Record<string, boolean>;
    spellCastTime: Record<string, number>;
    characterPowerPoints: Record<string, PowerPointsTrack>;
    activeCharacterId: string;
    characters: Record<string, Player>;
}

export const SpellsBar = () => {
    const { data: availableSpells, lastUpdateTime: availableSpellsUpdateTime } = useEngineModuleReader(GlobalStoreModule.AVAILABLE_SPELLS);
    const { data: spellCastTime, lastUpdateTime: spellCastTimeUpdateTime } = useEngineModuleReader(GlobalStoreModule.SPELL_CAST_TIME);
    const { data: characterPowerPoints, lastUpdateTime: characterPowerPointsTime } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
    const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);

    return <InternalSpellsBar
        lastUpdateTime={availableSpellsUpdateTime.toString() + spellCastTimeUpdateTime.toString() + characterPowerPointsTime.toString()}
        availableSpells={availableSpells as Record<string, boolean>}
        spellCastTime={spellCastTime as Record<string, number>}
        characterPowerPoints={characterPowerPoints as Record<string, PowerPointsTrack>}
        activeCharacterId={activeCharacterId}
        characters={characters as Record<string, Player>}
    />
}

const InternalSpellsBar: React.FunctionComponent<SpellsBarProps> = React.memo(({ availableSpells, spellCastTime, characterPowerPoints, activeCharacterId, characters }) => {
    const keyBoardContext = useContext(KeyBoardContext);
    const { spellDefinitions } = useSpellDefinitionProvider({ spellDefinitionIds: Object.keys(availableSpells) });
    const [clickedKey, setClickedKey] = useState('');

    const checkIfDisabled = useCallback((powerCost) => {
        if (powerCost > characterPowerPoints[activeCharacterId].currentSpellPower) {
            return 'grayscale(70%)';
        }

        return '';
    }, [characterPowerPoints[activeCharacterId].currentSpellPower]);

    useEffect(() => {
        keyBoardContext.addKeyHandler({
            id: 'activeSpellHightlight',
            matchRegex: '[0-9]',
            keydown: (key) => setClickedKey(key),
            keyup: () => setClickedKey(""),
        });

        return () => {
            keyBoardContext.removeKeyHandler('activeSpellHightlight');
        };
    }, []);

    if (!Object.keys(availableSpells).length) {
        return <></>
    }

    let counter = 0;

    return <div className={styles.spellsBarContainer}>
        {_.map(availableSpells, (_, spellId) => {
            counter++;
            const activeSpell = spellDefinitions[spellId] ?? {};

            return (
                <div key={spellId} className={styles.spellContainer}>
                    <div className={styles.keyboardNumber}>{counter}</div>
                    <div
                        className={classnames({
                            [styles.spellImage]: true,
                            [styles.spellHightlight]: counter.toString() == clickedKey,
                        })}
                        style={{
                            backgroundImage: `url(${activeSpell.image})`,
                            filter: checkIfDisabled(activeSpell.spellPowerCost),
                        }}
                    />
                    <div className={styles.spellHolder}>
                        <SpellLoader cooldown={activeSpell.cooldown} castTime={spellCastTime[spellId]} />
                    </div>
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
                </div>
            );
        })}
    </div>;
},
    (oldProps, newProps) => oldProps.lastUpdateTime === newProps.lastUpdateTime
);

