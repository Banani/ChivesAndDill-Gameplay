import { Tooltip } from '@mui/material';
import classnames from 'classnames';
import { FunctionComponent } from 'react';
import styles from './Circle.module.scss';

export enum CircleType {
    npc = 'npc',
    monster = 'monster',
    quest = 'quest',
    item = 'item',
    quote = 'quote',
    spell = 'spell'
}

const tooltipContent: Record<CircleType, string> = {
    [CircleType.npc]: "Npc occurrence",
    [CircleType.monster]: "Monster occurrence",
    [CircleType.quest]: "Connection with Quests",
    [CircleType.item]: "Conection with Items",
    [CircleType.quote]: "Amount of quotes",
    [CircleType.spell]: "Conection with spells"
}

interface CircleProps {
    number: number;
    type: CircleType;
}

export const Circle: FunctionComponent<CircleProps> = ({ number, type }) => {
    return (
        <Tooltip title={tooltipContent[type]} placement="right">
            <div className={classnames({ [styles['circle']]: true, [styles[type]]: true })}>
                {number}
            </div>
        </Tooltip>
    );
};
