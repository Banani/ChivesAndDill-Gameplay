import _ from 'lodash';
import React, { useContext } from 'react';
import { CharacterFramesContext } from '../characterFrames/CharacterFrames';
import styles from './TimeEffectsBar.module.scss';

export const TimeEffectsbar = ({ playerId }) => {
    const { timeEffects, absorbShields } = useContext(CharacterFramesContext);

    const debuffs = _.map(timeEffects, (debuff, i) => {
        if (debuff.targetId === playerId) {
            return (
                <>
                    <div key={debuff.id} className={styles.debuffImage} style={{ backgroundImage: `url(${debuff.iconImage})` }}></div>
                    <div className={styles.spellTooltip}>
                        <div>{debuff.name}</div>
                        <div>Period: {debuff.period / 1000} sec</div>
                        <div className={styles.spellDesc}>{debuff.description}</div>
                    </div>
                </>
            );
        }
    });

    const buffs = _.map(absorbShields, (buff, i) => {
        if (buff.ownerId === playerId) {
            return (
                <>
                    <div key={buff.id} className={styles.debuffImage} style={{ backgroundImage: `url(${buff.iconImage})` }}></div>
                    <div className={styles.spellTooltip}>
                        <div>{buff.name}</div>
                        <div>Period: {buff.period / 1000} sec</div>
                        <div className={styles.spellDesc}>{'value: ' + buff.value}</div>
                    </div>
                </>
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
