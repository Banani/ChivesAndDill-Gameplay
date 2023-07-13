import { GlobalStoreModule } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEngineModuleReader, useSpellDefinitionProvider } from 'apps/chives-and-dill/src/hooks';
import classnames from 'classnames';
import _, { now } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import styles from './SpellsBar.module.scss';

export const SpellsBar = () => {
    const { data: availableSpells } = useEngineModuleReader(GlobalStoreModule.AVAILABLE_SPELLS);
    const { data: spellCastTime } = useEngineModuleReader(GlobalStoreModule.SPELL_CAST_TIME);

    const keyBoardContext = useContext(KeyBoardContext);
    const { spellDefinitions } = useSpellDefinitionProvider({ spellDefinitionIds: Object.keys(availableSpells) });
    const [clickedKey, setClickedKey] = useState('');

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

    const getCooldownProgress = (spellId) => {
        if (!spellCastTime[spellId] || !spellDefinitions[spellId].cooldown) {
            return 100;
        }

        return Math.min(((now() - spellCastTime[spellId]) / spellDefinitions[spellId].cooldown) * 100, 100);
    }

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
                            [styles.spellHightlight]: counter.toString() == clickedKey
                        })}
                        style={{ backgroundImage: `url(${activeSpell.image})` }}
                    />
                    <div className={styles.spellLoader} style={{ background: `conic-gradient(rgba(0, 0, 0, 0) ${getCooldownProgress(spellId)}%, rgba(30, 30, 30, 0.75) 0)` }}></div>
                    <div className={styles.spellTooltip}>
                        <div>{activeSpell.name}</div>
                        <div>
                            <div>{activeSpell.spellPowerCost} Mana</div>
                            <div>{activeSpell.range} yd range</div>
                        </div>
                        <div>{activeSpell.channelTime ? `${activeSpell.channelTime / 1000} sec cast` : 'Instant cast'}</div>
                        <div>{'Cooldown: ' + activeSpell.cooldown / 1000 + ' sec'}</div>
                        <div className={styles.spellDesc}>{activeSpell.description}</div>
                    </div>
                </div>
            );
        })}
    </div>;
};
