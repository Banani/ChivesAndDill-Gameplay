import { map } from 'lodash';
import { useContext, useState } from 'react';
import { PackageContext } from '../../../contexts';


import { MapEditorContext } from '../contexts/mapEditorContextProvider';
import styles from './spritePanel.module.scss';

import FolderIcon from '@mui/icons-material/Folder';
import { Button } from '@mui/material';
import { ImageList } from '../../../components';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';
import { Pagination } from '../../components';

export const SpritePanel = () => {
    const packageContext = useContext(PackageContext);
    const mapEditorContext = useContext(MapEditorContext);
    const { setActiveDialog } = useContext(DialogContext);
    const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });

    const sprites = packageContext?.backendStore?.sprites?.data ? packageContext?.backendStore?.sprites?.data : {};

    return (
        <div className={styles['control-panel']}>
            <Button variant="outlined" onClick={() => setActiveDialog(Dialogs.SpriteGroupsDialog)}>
                <FolderIcon />
            </Button>

            <div className={styles['list-wrapper']}>
                <ImageList
                    activeId={mapEditorContext.activeSprite ?? ""}
                    imagesPerLine={3}
                    items={
                        map(Object.values(sprites).slice(paginationRange.start, paginationRange.end), (sprite: any, id) => {
                            return {
                                id: sprite.spriteId,
                                image: <div className={styles['imageHolder']}><img
                                    style={{ marginLeft: `${-sprite.x * 100}%`, marginTop: `${-sprite.y * 100}%` }}
                                    className={styles['image']}
                                    src={sprite.spriteSheet.indexOf('https') === -1 ? './assets/' + sprite.spriteSheet : sprite.spriteSheet}
                                    loading="lazy"
                                /></div>,
                                onClick: () => mapEditorContext.setActiveSprite(sprite.spriteId),
                            }
                        })
                    }
                />
            </div>
            <Pagination pageSize={33} itemsAmount={Object.keys(packageContext?.backendStore?.sprites?.data ?? {}).length} setRange={setPaginationRange} />
        </div>
    );
};
