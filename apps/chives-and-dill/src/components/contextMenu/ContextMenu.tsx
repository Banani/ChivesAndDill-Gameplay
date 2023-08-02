import { map } from 'lodash';
import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { MenuContext } from '../../contexts/MenuContext';

import styles from './ContextMenu.module.scss';

export const ContextMenu: FunctionComponent = () => {
    const menuContext = useContext(MenuContext);
    const [menuPosition, setMenuPosition] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });

    const updateMousePosition = useCallback((e) => {
        setMousePosition({ x: e.pageX, y: e.pageY });
    }, []);

    const mouseUp = useCallback((e) => {
        menuContext.setActions([]);
    }, []);

    useEffect(() => {
        //   window.addEventListener('mousemove', updateMousePosition);
        //   window.addEventListener('mouseup', mouseUp);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseup', mouseUp);
        };
    }, []);

    useEffect(() => {
        if (menuContext.actions.length > 0 && menuPosition === null) {
            setMenuPosition(mousePosition);
        }

        if (menuContext.actions.length === 0) {
            setMenuPosition(null);
        }
    }, [mousePosition, menuContext.actions]);

    return (
        menuContext.actions.length > 0 && (
            <div className={styles.wrapper} style={{ left: menuPosition?.x + 'px', top: menuPosition?.y + 'px' }}>
                {map(menuContext.actions, (action) => (
                    <div
                        className={styles.option}
                        onMouseDown={() => {
                            menuContext.setActions([]);
                            action.action();
                        }}
                    >
                        {action.label}
                    </div>
                ))}
            </div>
        )
    );
};
