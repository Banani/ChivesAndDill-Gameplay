import classNames from 'classnames';
import _ from 'lodash';
import { FunctionComponent } from 'react';
import { CircleBox } from '../circleBox';

import styles from './ImageList.module.scss';

interface ImageListProps {
    items: {
        id: string;
        name?: string;
        path?: string;
        image?: any;
        circles?: any;
        onClick?: (item: any) => void;
        actions?: {
            onClick: (item: any) => void;
            icon: any;
        }[];
    }[],
    // TODO: Change name
    imagesPerLine?: number;
    activeId: string,
}

export const ImageList: FunctionComponent<ImageListProps> = ({ items, activeId, imagesPerLine: imagePerLine = 2 }) => {
    const imageBoxSize = ((294 - 10 * (imagePerLine - 1)) / imagePerLine)
    const borderSize = 12;

    return (<div className={styles['list']}>
        {_.map(items, item => (
            <div
                key={item.id}
                style={{ width: imageBoxSize + "px", height: imageBoxSize + "px" }}
                className={classNames({
                    [styles['imageHolder']]: true,
                    [styles['active']]: activeId === item.id,
                })}
                onClick={() => item.onClick?.(item)}
            >
                {item.image ? item.image : <img style={{ width: (imageBoxSize - borderSize) + "px" }} className={styles['image']} src={item.path} />}
                {item.name ? <div className={styles['bar']}>{item.name}</div> : null}
                <CircleBox>
                    {item.circles}
                </CircleBox>
                <div className={styles['action-holder']}>
                    {_.map(item.actions, (action, key) => (
                        <div
                            key={key}
                            className={styles['action-icon']}
                            onClick={(e) => { e.stopPropagation(); action.onClick(item) }}
                        >
                            {action.icon}
                        </div>
                    ))}
                </div>
            </div>
        ))}</div>)
}