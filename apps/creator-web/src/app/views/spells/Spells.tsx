import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import { useContext, useState } from 'react';
import { PackageContext } from '../../contexts';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { DeleteConfirmationDialog } from '../../dialogs';

import { Spell } from '@bananos/types';
import _, { chain } from 'lodash';
import { ImagePreview } from '../../components';
import { Loader } from '../components';
import styles from './Spells.module.scss';
import { SpellsContext } from './SpellsContextProvider';

export const Spells = () => {
    const { setActiveDialog } = useContext(DialogContext);
    const packageContext = useContext(PackageContext);
    const { deleteSpell, setActiveSpell } = useContext(SpellsContext);
    const [spellsToDelete, setSpellsToDelete] = useState<Spell[]>([]);

    const { data: spells, lastUpdateTime: lastUpdateTimeSpells } = (packageContext?.backendStore?.spells ?? {});
    const { data: monsterTemplates, lastUpdateTime: lastUpdateTimeMonsterTemplates } = (packageContext?.backendStore?.monsterTemplates ?? {});
    const { data: characterClasses, lastUpdateTime: lastUpdateTimeCharacterClasses } = (packageContext?.backendStore?.characterClasses ?? {});

    if (!lastUpdateTimeSpells || !lastUpdateTimeCharacterClasses || !lastUpdateTimeMonsterTemplates) {
        return <Loader />;
    }

    return (
        <>
            <DeleteConfirmationDialog
                itemsToDelete={spellsToDelete.map((item) => item.name)}
                cancelAction={() => setSpellsToDelete([])}
                confirmAction={() => {
                    if (spellsToDelete.length > 0) {
                        deleteSpell(spellsToDelete[0]?.id as string);
                        setSpellsToDelete([]);
                    }
                }}
            />
            <Paper className={styles['map-editor']}>
                <div className={styles['manage-panel']}>
                    <Button
                        className={styles['add-button']}
                        variant="outlined"
                        onClick={() => {
                            setActiveDialog(Dialogs.SpellDialog);
                        }}
                    >
                        <AddIcon />
                    </Button>
                </div>

                <div className={styles['list-holder']}>
                    <DataGrid
                        disableSelectionOnClick
                        rows={_.map(spells, spell => spell)}
                        getRowId={(row) => row.id}
                        columns={[
                            {
                                field: 'image',
                                headerName: 'Image',
                                align: 'center',
                                renderCell: (params: GridRenderCellParams<Spell>) =>
                                    <ImagePreview src={params.row.image} />
                            },
                            {
                                field: 'name',
                                headerName: 'Name',
                                width: 240,
                            },
                            {
                                field: 'assigned',
                                headerName: 'Assigned',
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<Spell>) =>
                                    chain(characterClasses)
                                        .filter(characterClass => characterClass.spells[params.row.id])
                                        .map(characterClass => characterClass.name)
                                        .value()
                                        .concat(chain(monsterTemplates)
                                            .filter(characterClass => characterClass.spells[params.row.id])
                                            .map(characterClass => characterClass.name)
                                            .value())
                                        .join(", ")
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
                                                setActiveDialog(Dialogs.SpellDialog);
                                                setActiveSpell(row)
                                            }}
                                        />,
                                        <GridActionsCellItem
                                            label="Delete"
                                            icon={<DeleteIcon />}
                                            onClick={() => {
                                                setSpellsToDelete([row])
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
