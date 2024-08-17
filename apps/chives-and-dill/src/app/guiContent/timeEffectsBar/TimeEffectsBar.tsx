import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React from 'react';
import styles from './TimeEffectsBar.module.scss';

export const TimeEffectsBar = ({ playerId }) => {
    const { data: timeEffects } = useEngineModuleReader(GlobalStoreModule.TIME_EFFECTS);
    const { data: absorbShields } = useEngineModuleReader(GlobalStoreModule.ABSORB_SHIELDS);

    const debuffs = _.map(timeEffects, (debuff, i) => {
        if (debuff.targetId === playerId) {
            return (
                <React.Fragment key={debuff.id}>
                    <div className={styles.debuffImage} style={{ backgroundImage: `url(${debuff.iconImage})` }}></div>
                    <div className={styles.spellTooltip}>
                        <div>{debuff.name}</div>
                        <div>Period: {debuff.period / 1000} sec</div>
                        <div className={styles.spellDesc}>{debuff.description}</div>
                    </div>
                </React.Fragment>
            );
        }
    });

    const buffs = _.map(absorbShields, (buff, i) => {
        if (buff.ownerId === playerId) {
            return (
                <React.Fragment key={buff.id}>
                    <div className={styles.debuffImage} style={{ backgroundImage: `url(${buff.iconImage})` }}></div>
                    <div className={styles.spellTooltip}>
                        <div>{buff.name}</div>
                        <div>Period: {buff.period / 1000} sec</div>
                        <div className={styles.spellDesc}>{'value: ' + buff.value}</div>
                    </div>
                </React.Fragment>
            );
        }
    });

    return (
        <div className={styles.barContainer}>
            {debuffs}
            {buffs}
        </div>
    );
};
