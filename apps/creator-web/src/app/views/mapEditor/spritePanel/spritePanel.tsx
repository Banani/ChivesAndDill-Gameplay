import { map } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { PackageContext } from '../../../contexts';


import { MapEditorContext } from '../contexts/mapEditorContextProvider';
import styles from './spritePanel.module.scss';

import FolderIcon from '@mui/icons-material/Folder';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import _ from 'lodash';
import { ImageList } from '../../../components';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';
import { Pagination } from '../../components';

enum SpriteGroupFilterModes {
    All = "All",
}

interface SpriteGroup {
    name: string,
    spriteAssignment: Record<string, boolean>
}

export const SpritePanel = () => {
    const packageContext = useContext(PackageContext);
    const mapEditorContext = useContext(MapEditorContext);
    const { setActiveDialog } = useContext(DialogContext);
    const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });
    const [spriteGroupFilter, setSpriteGroupFilter] = useState<SpriteGroupFilterModes | string>(SpriteGroupFilterModes.All);

    const sprites = packageContext?.backendStore?.sprites?.data ?? {};
    const spriteGroups = (packageContext?.backendStore?.spriteGroups?.data ?? {}) as Record<string, SpriteGroup>;
    const [filteredSprites, setFilteredSprites] = useState<Record<string, SpriteGroup>>({});
    const [paginationReset, setPaginationReset] = useState(1);

    const spriteGroupSelectOptions = [
        { id: SpriteGroupFilterModes.All, name: SpriteGroupFilterModes.All },
        ..._.map(spriteGroups, ((spriteGroup, key) => ({
            id: key,
            name: spriteGroup.name
        }))),
    ]

    useEffect(() => {
        const spriteGroup = spriteGroups[spriteGroupFilter];

        if (spriteGroupFilter == SpriteGroupFilterModes.All || !spriteGroup) {
            setFilteredSprites(sprites)
            return;
        }

        setFilteredSprites(_.pickBy(sprites, (sprite: any) => spriteGroup.spriteAssignment[sprite.id]))
        setPaginationReset(prev => (prev + 1) % 2)

    }, [spriteGroupFilter, sprites, spriteGroups]);

    return (
        <div className={styles['control-panel']}>
            <div className={styles['sprite-group-panel']}>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="group-id">Sprite Group</InputLabel>
                    <Select labelId="group-id" value={spriteGroupFilter} label="Sprite Group" onChange={(e) => setSpriteGroupFilter(e.target.value ?? SpriteGroupFilterModes.All)}>
                        {spriteGroupSelectOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button className={styles['modal-opener']} variant="outlined" onClick={() => setActiveDialog(Dialogs.SpriteGroupsDialog)}>
                    <FolderIcon />
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
