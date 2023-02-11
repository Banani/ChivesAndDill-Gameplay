import classnames from 'classnames';
import { FunctionComponent } from 'react';
import styles from './Circle.module.scss';

export enum CircleType {
    npc = 'npc',
    monster = 'monster',
    quest = 'quest',
    item = 'item',
}

interface CircleProps {
    number: number;
    type: CircleType;
}

export const Circle: FunctionComponent<CircleProps> = ({ number, type }) => {
    return (
        <div className={classnames({ [styles['circle']]: true, [styles[type]]: true })}>
            {number}
        </div>
    );
};
