import React, { useContext, useEffect, useRef, useState } from 'react';
import { GetAbsorbsValue } from '../../../player/GetPlayerAbsorbs';
import { CharacterFramesContext } from '../CharacterFrames';
import { OptionsModal } from '../optionsModal/OptionsModal';
import styles from './PlayerIcon.module.scss';

export const PlayerIcon = ({ playerId }) => {
    const { characters, characterPowerPoints, powerStacks, combatState, experience } = useContext(CharacterFramesContext);

    const player = characters[playerId];
    const { name, avatar } = player;
    const playerAbsorb = GetAbsorbsValue(playerId);
    const [absorbBarWidth, setAbsorbBarWidth] = useState(0);
    const [optionsVisible, setOptionsVisible] = useState(false);

    const HolyPower = powerStacks?.[playerId]?.HolyPower;
    const playerPoints = characterPowerPoints[playerId] ?? { maxHp: 0, currentHp: 0, currentSpellPower: 0, maxSpellPower: 0 };
    const { maxHp, currentHp, currentSpellPower, maxSpellPower } = playerPoints;

    const avatarContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!playerPoints) {
            return;
        }

        setAbsorbBarWidth((playerAbsorb / (playerAbsorb + playerPoints.maxHp)) * 100);
    }, [playerAbsorb, playerPoints]);

    if (!playerPoints) {
        return <></>;
    }

    const renderPowerStacks = (stacksType, amount) => {
        if (!amount) {
            return;
        }
        return Array.from(Array(amount).keys()).map((i) => <div className={styles.powerStackCircle} />);
    };

    const avatarClick = (e) => {
        e.preventDefault();
        setOptionsVisible(prevState => !prevState);
    };

    return (
        <div>
            <div className={styles.playerIconContainer}>
                <div
                    onContextMenu={(e) => avatarClick(e)}
                    className={styles.playerAvatar + " " + (combatState[playerId] ? styles.combatBorder : "")}
                    style={{ backgroundImage: `url(${avatar})` }}
                    ref={avatarContainer}
                ></div>
                <div className={styles.combatSwords} style={combatState[playerId] ? { visibility: "visible", opacity: '1' } : null}></div>
                <div className={styles.playerLvl}>{experience[playerId]?.level}</div>
                <div className={styles.playerRole} />
                <div>
                    <div className={styles.barsContainer + " " + (combatState[playerId] ? styles.combatBorder : "")}>
                        <div className={styles.nameBar}>{name}</div>
                        <div className={styles.bar}>
                            <div className={styles.barText}>{currentHp >= 0 ? currentHp + '/' + maxHp : 0}</div>
                            <div className={styles.hpColor} style={{ width: currentHp >= 0 ? (currentHp / (maxHp + playerAbsorb)) * 100 + '%' : '0' }}></div>
                            <div className={styles.absorbColor} style={{ width: absorbBarWidth + '%', left: `${(currentHp / (maxHp + playerAbsorb)) * 100}%` }}></div>
                        </div>
                        <div className={styles.bar}>
                            <div className={styles.barText}>{currentSpellPower >= 0 ? currentSpellPower + '/' + maxSpellPower : 0}</div>
                            <div className={styles.manaColor} style={{ width: currentSpellPower >= 0 ? (currentSpellPower / maxSpellPower) * 100 + '%' : '0' }}></div>
                        </div>
                    </div>
                    <div className={styles.powerStacks}>{renderPowerStacks('HolyPower', HolyPower)}</div>
                </div>
            </div>
            {optionsVisible && player.type === 'Player' ? <OptionsModal openTooltipContainer={avatarContainer} optionsVisible={optionsVisible} setOptionsVisible={setOptionsVisible} playerId={playerId} /> : null}
        </div >
    );
};
