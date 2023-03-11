import AddIcon from '@mui/icons-material/Add';

import { Autocomplete, Button, DialogActions, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import _, { map } from 'lodash';
import { FunctionComponent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FormTextField, ImageList } from '../../components';
import { KeyBoardContext, PackageContext } from '../../contexts';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { FormContext, FormContextProvider, FormFieldConditions, Schema, SchemaFieldType } from '../../contexts/FormContext';
import { SpriteGroupFilterModes, useSpriteGroupFilter } from '../../hooks';
import { Pagination } from '../../views/components';
import { SpriteGroupContext } from '../spriteGroupDialog/SpriteGroupContext';

import styles from "./EditSpriteGroupDialog.module.scss";

export const EditSpriteGroupDialog = () => {
    const { activeSpriteGroup } = useContext(SpriteGroupContext);

    const schema: Schema = useMemo(() => {
        return {
            name: {
                type: SchemaFieldType.Text,
                conditions: [{ type: FormFieldConditions.Required }],
                defaultValue: activeSpriteGroup?.name ?? ""
            }
        }
    }, [activeSpriteGroup])

    return <FormContextProvider schema={schema}><EditSpriteGroupDialogContent /></FormContextProvider>
}

const EditSpriteGroupDialogContent: FunctionComponent = ({ }) => {
    const { activeDialog, setActiveDialog } = useContext(DialogContext);
    const { errors, setFormDirty, resetForm, getFieldValue } = useContext(FormContext);
    const { updateSpriteGroup, activeSpriteGroup } = useContext(SpriteGroupContext);
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

    useEffect(() => {
        if (activeSpriteGroup) {
            setSelectedSprites(activeSpriteGroup.spriteAssignment)
        }
    }, [activeSpriteGroup])

    useEffect(() => {
        if (activeDialog !== Dialogs.EditSpriteGroupsDialog) {
            resetForm();
        }
    }, [activeDialog === Dialogs.EditSpriteGroupsDialog]);

    const confirmUpdate = useCallback(() => {
        if (_.filter(errors, err => err != '').length > 0) {
            setFormDirty();
            return;
        }


        updateSpriteGroup({ id: activeSpriteGroup.id, name: getFieldValue('name'), spriteAssignment: selectedSprites })
        setActiveDialog(Dialogs.SpriteGroupsDialog)
    }, [errors, setFormDirty, getFieldValue, selectedSprites]);

    return (
        <Dialog open={activeDialog === Dialogs.EditSpriteGroupsDialog} onClose={() => setActiveDialog(Dialogs.SpriteGroupsDialog)} maxWidth="xl">
            {activeDialog === Dialogs.EditSpriteGroupsDialog ? <>
                <DialogTitle>Sprites Assignment</DialogTitle>
                <DialogContent className={styles['dialog']}>

                    <div className={styles['adding-row']}>
                        <FormTextField propName={`name`} label="Name" />
                        <Button className={styles['add-button']} variant="outlined" onClick={() => confirmUpdate()}><AddIcon /></Button>
                    </div>

                    <div className={styles['sprites-assignment-panel']}>
                        <div className={styles['sprites-container']}>
                            <div className={styles['available-sprites']}>
                                <Autocomplete
                                    className={styles['group-selection-holder']}
                                    disableClearable
                                    value={spriteGroupSelectOptions.find(option => option.id === spriteGroupFilter)}
                                    options={spriteGroupSelectOptions.filter(option => option.id !== activeSpriteGroup.id)}
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
                    <Button onClick={() => setActiveDialog(Dialogs.SpriteGroupsDialog)} variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </> : null}
        </Dialog>
    );
};
