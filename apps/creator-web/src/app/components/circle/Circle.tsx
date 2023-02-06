import { FunctionComponent } from 'react';
import styles from './Circle.module.scss';

interface CircleProps {
   number: number;
}

export const Circle: FunctionComponent<CircleProps> = ({ number }) => {
   return <div className={styles['circle']}>{number}</div>;
};
