
import { Autocomplete, Button, DialogActions, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import _, { map } from 'lodash';
import { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { ImageList } from '../../components';
import { KeyBoardContext, PackageContext } from '../../contexts';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { SpriteGroupFilterModes, useSpriteGroupFilter } from '../../hooks';
import { Pagination } from '../../views/components';

import styles from "./EditAnimatedSpritesDialog.module.scss";


export const EditAnimatedSpritesDialog: FunctionComponent = ({ }) => {
    const { activeDialog, setActiveDialog } = useContext(DialogContext);
    const [selectedSprites, setSelectedSprites] = useState<Record<string, boolean>>({});
    const keyBoardContext = useContext(KeyBoardContext);

    const [allPaginationRange, setAllPaginationRange] = useState({ start: 0, end: 0 });
    const [selectedPaginationRange, setSelectedPaginationRange] = useState({ start: 0, end: 0 });
    const {
        filteredSprites,
        spriteGroupFilter,
        setSpriteGroupFilter,
        spriteGroupSelectOptions } = useSpriteGroupFilter();

    const packageContext = useContext(PackageContext);
    const sprites = packageContext?.backendStore?.sprites?.data ?? {};
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
        const spritesAmount = Object.keys(selectedSprites).length
        if (spritesAmount === 0) {
            return;
        }

        const interval = setInterval(() => {
            setAnimationStep(prev => (prev + 1) % spritesAmount)
        }, 200);

        return () => clearInterval(interval);
    }, [selectedSprites]);
    // useEffect(() => {
    //     if (activeSpriteGroup) {
    //         setSelectedSprites(activeSpriteGroup.spriteAssignment)
    //     }
    // }, [activeSpriteGroup])

    const confirmUpdate = useCallback(() => {
        // updateSpriteGroup({ id: activeSpriteGroup.id, name: getFieldValue('name'), spriteAssignment: selectedSprites })
        setActiveDialog(Dialogs.AnimatedSpritesDialog)
    }, [selectedSprites]);

    const currentSprite = Object.keys(selectedSprites).length >= animationStep ? sprites[Object.keys(selectedSprites)[animationStep]] : null;

    return (
        <Dialog open={activeDialog === Dialogs.EditAnimatedSpritesDialog} onClose={() => setActiveDialog(Dialogs.AnimatedSpritesDialog)} maxWidth="xl">
            {activeDialog === Dialogs.EditAnimatedSpritesDialog ? <>
                <DialogTitle>Animation Edit</DialogTitle>
                <DialogContent className={styles['dialog']}>
                    <div className={styles['sprites-assignment-panel']}>
                        <div className={styles['sprites-container']}>
                            <div className={styles['available-sprites']}>
                                <Autocomplete
                                    className={styles['group-selection-holder']}
                                    disableClearable
                                    value={spriteGroupSelectOptions.find(option => option.id === spriteGroupFilter)}
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
                                <ImageList
                                    activeId={""}
                                    imagesPerLine={3}
                                    items={
                                        map(Object.values(_.pickBy(filteredSprites, (sprite: any) => !selectedSprites[sprite.id]))
                                            .slice(allPaginationRange.start, allPaginationRange.end), (sprite: any) => {
                                                return {
                                                    id: sprite.id,
                                                    image: <div className={styles['imageHolder']}><img
                                                        style={{ marginLeft: `${-sprite.x * 100}%`, marginTop: `${-sprite.y * 100}%` }}
                                                        className={styles['image']}
                                                        src={sprite.spriteSheet.indexOf('https') === -1 ? './assets/' + sprite.spriteSheet : sprite.spriteSheet}
                                                        loading="lazy"
                                                    /></div>,
                                                    onClick: () => setSelectedSprites(prev => ({ ...prev, [sprite.id]: true })),
                                                }
                                            })
                                    }
                                />
                            </div>
                            <div className={styles['pagination-centerer']}>
                                <div className={styles['pagination-holder']}>
                                    <Pagination pageSize={49} itemsAmount={Object.keys(sprites).length} setRange={setAllPaginationRange} />
                                </div>
                            </div>
                        </div>

                        <div className={styles['sprites-container']}>
                            <div className={styles['selected-sprites']}>
                                <ImageList
                                    activeId={""}
                                    imagesPerLine={3}
                                    items={
                                        map(Object.keys(selectedSprites).slice(selectedPaginationRange.start, selectedPaginationRange.end), (spriteId) => {
                                            return {
                                                id: spriteId,
                                                image: <div className={styles['imageHolder']}><img
                                                    style={{ marginLeft: `${-sprites[spriteId].x * 100}%`, marginTop: `${-sprites[spriteId].y * 100}%` }}
                                                    className={styles['image']}
                                                    src={sprites[spriteId].spriteSheet.indexOf('https') === -1 ? './assets/' + sprites[spriteId].spriteSheet : sprites[spriteId].spriteSheet}
                                                    loading="lazy"
                                                /></div>,
                                                onClick: () => setSelectedSprites(prev => _.pickBy(prev, (_, key) => key != spriteId)),
                                            }
                                        })
                                    }
                                />
                            </div>
                            <div className={styles['animation-preview']}>
                                <div className={styles['image-wrapper']}>
                                    {currentSprite ?
                                        <div className={styles['imageHolder']}>
                                            <img
                                                style={{ marginLeft: `${-currentSprite.x * 100}%`, marginTop: `${-currentSprite.y * 100}%` }}
                                                className={styles['image']}
                                                src={currentSprite.spriteSheet.indexOf('https') === -1 ? './assets/' + currentSprite.spriteSheet : currentSprite.spriteSheet}
                                            />
                                        </div>
                                        : null}
                                </div>
                            </div>
                            <div className={styles['pagination-centerer']}>
                                <div className={styles['pagination-holder']}>
                                    <Pagination pageSize={49} itemsAmount={Object.keys(selectedSprites).length} setRange={setSelectedPaginationRange} />
                                </div>
                            </div>
                        </div>

                    </div>

                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={confirmUpdate}
                        variant="contained"
                    >
                        Update
                    </Button>
                    <Button onClick={() => setActiveDialog(Dialogs.AnimatedSpritesDialog)} variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </> : null}
        </Dialog>
    );
};
