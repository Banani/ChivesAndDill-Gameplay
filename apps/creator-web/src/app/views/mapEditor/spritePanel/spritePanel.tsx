import { map } from 'lodash';
import { useContext, useEffect, useState } from 'react';


import { MapEditorContext } from '../contexts/mapEditorContextProvider';
import styles from './spritePanel.module.scss';

import AnimationIcon from '@mui/icons-material/Animation';
import FolderIcon from '@mui/icons-material/Folder';
import { Button, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { ImageList } from '../../../components';
import { KeyBoardContext } from '../../../contexts';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';
import { SpriteGroupFilterModes, useSpriteGroupFilter } from '../../../hooks';
import { Pagination } from '../../components';

export interface SpriteGroup {
    name: string,
    spriteAssignment: Record<string, boolean>
}

export const SpritePanel = () => {
    const mapEditorContext = useContext(MapEditorContext);
    const { setActiveDialog } = useContext(DialogContext);
    const keyBoardContext = useContext(KeyBoardContext);
    const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });
    const [paginationReset, setPaginationReset] = useState(1);
    const {
        filteredSprites,
        spriteGroupFilter,
        setSpriteGroupFilter,
        spriteGroupSelectOptions } = useSpriteGroupFilter();

    useEffect(() => {
        setPaginationReset(prev => (prev + 1) % 2)
    }, [filteredSprites]);

    return (
        <div className={styles['control-panel']}>
            <div className={styles['sprite-group-panel']}>
                <Autocomplete
                    disableClearable
                    value={spriteGroupSelectOptions.find(option => option.id === spriteGroupFilter)}
                    className={styles['sprite-group-select']}
                    options={spriteGroupSelectOptions}
                    renderInput={(params) => <TextField {...params} label="Sprite Group" />}
                    getOptionLabel={(option) => option.name}
                    onFocus={() => keyBoardContext.addKeyHandler({ id: 'ChatBlockAll', matchRegex: '.*' })}
                    onBlur={() => keyBoardContext.removeKeyHandler('ChatBlockAll')}
                    onChange={(_, newValue) => {
                        if (newValue === null) {
                            setSpriteGroupFilter(SpriteGroupFilterModes.All);
                        } else {
                            setSpriteGroupFilter(newValue?.id ?? "");
                        }
                    }}
                />
                <Button className={styles['modal-opener']} variant="outlined" onClick={() => setActiveDialog(Dialogs.SpriteGroupsDialog)}>
                    <FolderIcon />
                </Button>
                <Button className={styles['modal-opener']} variant="outlined" onClick={() => setActiveDialog(Dialogs.AnimatedSpritesDialog)}>
                    <AnimationIcon />
                </Button>
            </div>

            <div className={styles['list-wrapper']}>
                <ImageList
                    activeId={mapEditorContext.activeSprite ?? ""}
                    imagesPerLine={3}
                    items={
                        map(Object.values(filteredSprites).slice(paginationRange.start, paginationRange.end), (sprite: any, id) => {
                            return {
                                id: sprite.id,
                                image: <div className={styles['imageHolder']}><img
                                    style={{ marginLeft: `${-sprite.x * 100}%`, marginTop: `${-sprite.y * 100}%` }}
                                    className={styles['image']}
                                    src={sprite.spriteSheet.indexOf('https') === -1 ? './assets/' + sprite.spriteSheet : sprite.spriteSheet}
                                    loading="lazy"
                                /></div>,
                                onClick: () => mapEditorContext.setActiveSprite(sprite.id),
                            }
                        })
                    }
                />
            </div>
            <Pagination pageSize={30} itemsAmount={Object.keys(filteredSprites).length} setRange={setPaginationRange} reset={paginationReset} />
        </div>
    );
};
