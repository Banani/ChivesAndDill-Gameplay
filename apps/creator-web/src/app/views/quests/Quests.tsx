import { QuestSchema } from '@bananos/types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext, useState } from 'react';
import { ItemPreview } from '../../components/itemPreview';
import { PackageContext } from '../../contexts';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { DeleteConfirmationDialog } from '../../dialogs';

import styles from './Quests.module.scss';
import { QuestsContext } from './QuestsContextProvider';

export const Quests = () => {
    const { setActiveDialog } = useContext(DialogContext);
    const packageContext = useContext(PackageContext);
    const { deleteQuest, setActiveQuest } = useContext(QuestsContext);
    const [questsToDelete, setQuestsToDelete] = useState<QuestSchema[]>([]);

    const questSchemas = packageContext?.backendStore?.questSchemas?.data ?? {};
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};
    const npcTemplates = packageContext?.backendStore?.npcTemplates?.data ?? {};

    return (
        <>
            <DeleteConfirmationDialog
                itemsToDelete={questsToDelete.map((item) => item.name)}
                cancelAction={() => setQuestsToDelete([])}
                confirmAction={() => {
                    if (questsToDelete.length > 0) {
                        deleteQuest(questsToDelete[0]?.id);
                        setQuestsToDelete([]);
                    }
                }}
            />
            <Paper className={styles['map-editor']}>
                <div className={styles['manage-panel']}>
                    <Button
                        className={styles['add-button']}
                        variant="outlined"
                        onClick={() => {
                            setActiveDialog(Dialogs.QuestDialog);
                        }}
                    >
                        <AddIcon />
                    </Button>
                </div>

                <div className={styles['list-holder']}>
                    <DataGrid
                        disableSelectionOnClick
                        rows={_.map(questSchemas, quest => quest)}
                        getRowId={(row) => row.id}
                        columns={[
                            {
                                field: 'name',
                                headerName: 'Name',
                                flex: 1,
                            },
                            {
                                field: 'questReward.experience',
                                headerName: 'Experience',
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                                    return params.row.questReward.experience;
                                }
                            },
                            {
                                field: 'questReward.currency',
                                headerName: 'Money reward (in coppers)',
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                                    return params.row.questReward.currency;
                                },
                            },
                            {
                                field: 'questReward.items',
                                headerName: 'Items reward',
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                                    return <>
                                        {_.map(params.row.questReward.items, item =>
                                            <ItemPreview key={item.itemTemplateId} itemTemplate={itemTemplates[item.itemTemplateId]} />
                                        )}
                                    </>
                                },
                            },
                            {
                                field: 'stages',
                                headerName: 'Stages',
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<QuestSchema>) =>
                                    Object.keys(params.row.stages ?? {}).length,
                            },
                            {
                                field: 'substages',
                                headerName: 'Substages',
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<QuestSchema>) =>
                                    _.sum(_.map(params.row.stages ?? {}, stage => Object.keys(stage.stageParts ?? {}).length))
                            },
                            {
                                field: 'npcs_amount',
                                headerName: 'Assigned to NPCs',
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                                    return <>
                                        {_.filter(npcTemplates, npcTemplate => npcTemplate.quests[params.row.id]).length}
                                    </>
                                },
                            },
                            {
                                field: 'requiredLevel',
                                headerName: 'Required level',
                                flex: 1,
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
                                                setActiveDialog(Dialogs.QuestDialog);
                                                setActiveQuest(row)
                                            }}
                                        />,
                                        <GridActionsCellItem
                                            label="Delete"
                                            icon={<DeleteIcon />}
                                            onClick={() => {
                                                setQuestsToDelete([row])
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
