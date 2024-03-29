import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import { useContext, useState } from 'react';
import { PackageContext } from '../../contexts';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { DeleteConfirmationDialog } from '../../dialogs';

import { CharacterClass } from '@bananos/types';
import _ from 'lodash';
import { ImagePreview, SpellPreview } from '../../components';
import { Loader } from '../components';
import styles from './CharacterClasses.module.scss';
import { CharacterClassesContext } from './CharacterClassesContextProvider';

export const CharacterClasses = () => {
    const { setActiveDialog } = useContext(DialogContext);
    const packageContext = useContext(PackageContext);
    const { deleteCharacterClass, setActiveCharacterClass } = useContext(CharacterClassesContext);
    const [characterClassesToDelete, setCharacterClassesToDelete] = useState<CharacterClass[]>([]);

    const { data: characterClasses, lastUpdateTime: lastUpdateTimeCharacterClasses } = (packageContext?.backendStore?.characterClasses ?? {});
    const { data: spells, lastUpdateTime: lastUpdateTimeSpells } = (packageContext?.backendStore?.spells ?? {});

    if (!lastUpdateTimeSpells || !lastUpdateTimeCharacterClasses) {
        return <Loader />;
    }

    return (
        <>
            <DeleteConfirmationDialog
                itemsToDelete={characterClassesToDelete.map((item) => item.name)}
                cancelAction={() => setCharacterClassesToDelete([])}
                confirmAction={() => {
                    if (characterClassesToDelete.length > 0) {
                        deleteCharacterClass(characterClassesToDelete[0]?.id as string);
                        setCharacterClassesToDelete([]);
                    }
                }}
            />
            <Paper className={styles['map-editor']}>
                <div className={styles['manage-panel']}>
                    <Button
                        className={styles['add-button']}
                        variant="outlined"
                        onClick={() => {
                            setActiveDialog(Dialogs.CharacterClassDialog);
                        }}
                    >
                        <AddIcon />
                    </Button>
                </div>

                <div className={styles['list-holder']}>
                    <DataGrid
                        disableSelectionOnClick
                        rows={_.map(characterClasses, spell => spell)}
                        getRowId={(row) => row.id}
                        columns={[
                            {
                                field: 'iconImage',
                                headerName: 'Icon Image',
                                align: 'center',
                                renderCell: (params: GridRenderCellParams<CharacterClass>) =>
                                    <ImagePreview src={params.row.iconImage} />
                            },
                            {
                                field: 'color',
                                headerName: 'Color',
                                renderCell: (params: GridRenderCellParams<CharacterClass>) => {
                                    return <div className={styles['color-box']} style={{ backgroundColor: params.row.color }}></div>
                                }

                            },
                            {
                                field: 'name',
                                headerName: 'Name',
                            },
                            {
                                field: 'spells',
                                headerName: 'Spells',
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<CharacterClass>) => {
                                    return _.map(params.row.spells, spell =>
                                        <SpellPreview key={spell.spellId} spell={spells[spell.spellId]} />
                                    )
                                }

                            },
                            {
                                field: 'actions',
                                headerName: 'Actions',
                                type: 'actions',
                                width: 80,
                                getActions: ({ row }) =>
                                    [
                                        <GridActionsCellItem
                                            label="Edit"
                                            icon={<ModeEditIcon />}
                                            onClick={() => {
                                                setActiveDialog(Dialogs.CharacterClassDialog);
                                                setActiveCharacterClass(row)
                                            }}
                                        />,
                                        <GridActionsCellItem
                                            label="Delete"
                                            icon={<DeleteIcon />}
                                            onClick={() => {
                                                setCharacterClassesToDelete([row])
                                            }}
                                        />,
                                    ]
                                ,
                            }
                        ]}
                        autoPageSize
                        density="compact"
                    />
                </div>
            </Paper>
        </>
    );
};
