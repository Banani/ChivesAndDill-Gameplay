import { Graphics } from '@inlet/react-pixi';
import React from 'react';
import { GetAbsorbsValue } from './GetPlayerAbsorbs';

export const PlayerBars = ({ charactersMovements, player, playerPoints, h }) => {

    const playerAbsorb = GetAbsorbsValue(player.id);
    const { maxHp, currentHp } = playerPoints;

    const drawAbsorbBar = (g) => {
        const barWidth = (playerAbsorb / (playerAbsorb + maxHp)) * 50;
        const healthBarWidth = (currentHp / (playerAbsorb + maxHp)) * 50 - 25;
        g.beginFill(0xe8e8e8);
        g.drawRect(charactersMovements[player.id].location.x + healthBarWidth, charactersMovements[player.id].location.y - h / 1.5, barWidth, 5);
        g.endFill();
    };

    const drawHealthBar = (g) => {
        const barWidth = (currentHp / (playerAbsorb + maxHp)) * 50;
        g.beginFill(0xff0000);
        g.drawRect(charactersMovements[player.id].location.x - 25, charactersMovements[player.id].location.y - h / 1.5, 50, 5);
        g.endFill();
        g.beginFill(0x00ff00);
        g.drawRect(charactersMovements[player.id].location.x - 25, charactersMovements[player.id].location.y - h / 1.5, barWidth, 5);
        g.endFill();
    };

    const hpBar = (g) => {
        g.clear();
        g.beginFill(0x000000);
        g.drawRect(charactersMovements[player.id].location.x - 26, charactersMovements[player.id].location.y - h / 1.5 - 1, 52, 7);
        g.endFill();
        drawHealthBar(g);
        drawAbsorbBar(g);
    };

    return (
        <Graphics draw={hpBar} zIndex={2} />
    )
}