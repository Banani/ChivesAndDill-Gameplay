import { CharacterClass } from '@bananos/types';
import React from 'react';
import { DatailsStats } from '../hooks/useDetailsStats';
import styles from './Player.module.scss';

interface PlayerProps {
    highestAmount: number,
    detailsStat: DatailsStats,
    playerCharacter: any,
    index: number,
    characterClass: CharacterClass,
    fightTime: number,
}

export const Player = ({ highestAmount, fightTime, detailsStat, playerCharacter, index, characterClass }: PlayerProps) => {

    const dpsPerSec = Math.ceil(detailsStat.amount / fightTime);

    return (
        <div className={styles.Player}>
            <img src={characterClass?.iconImage ?? 'https://static.wikia.nocookie.net/wowwiki/images/e/ec/Ability_rogue_vendetta.png'} className={styles.ClassIcon}></img>
            <div className={styles.BarHolder}>
                <div className={styles.ColorBar} style={{
                    right: (100 - (detailsStat.amount / highestAmount) * 100) + '%',
                    backgroundColor: characterClass?.color ?? 'red',
                    borderBottom: '1px solid ' + (characterClass?.color ?? 'red'),
                    borderTop: '1px solid ' + (characterClass?.color ?? 'red'),
                }}
                ></div>
                <div className={styles.DataHolder}>
                    <div className={styles.PlayerName}>{index}. {playerCharacter.name}</div>
                    <div className={styles.PlayerData}>{detailsStat.amount}</div>
                    <div className={styles.PlayerData}>{dpsPerSec}</div>
                </div>
            </div>
        </div>
    )
}