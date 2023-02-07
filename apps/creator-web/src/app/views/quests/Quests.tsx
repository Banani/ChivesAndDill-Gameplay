import { QuestSchema } from '@bananos/types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext, useState } from 'react';
import { PackageContext } from '../../contexts';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { DeleteConfirmationDialog } from '../../dialogs';

import styles from './Quests.module.scss';
import { QuestsContext } from './QuestsContextProvider';

export const Quests = () => {
    const { setActiveDialog } = useContext(DialogContext);
    const packageContext = useContext(PackageContext);
    const { deleteQuest } = useContext(QuestsContext);
    const [questsToDelete, setQuestsToDelete] = useState<QuestSchema[]>([]);
    //    const [searchFilter, setSearchFilter] = useState('');

    const questSchemas = packageContext?.backendStore?.questSchemas?.data ?? {};
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};

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
                    {/* <TextField
                  value={searchFilter}
                  onChange={(e) => {
                     setSearchFilter(e.target.value);
                     setPaginationReset((prev) => prev + 1);
                  }}
                  margin="dense"
                  label="Search by name"
                  fullWidth
                  variant="standard"
                  type="text"
               /> */}

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
                                            <img src={itemTemplates[item.itemTemplateId].image} className={styles['item-image-preview']} />
                                        )}
                                    </>
                                },
                            },
                            {
                                field: 'actions',
                                headerName: 'Actions',
                                type: 'actions',
                                width: 80,
                                getActions: ({ row }) =>
                                    [
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
                        pageSize={28}
                        density="compact"
                    />

                </div>
            </Paper>
        </>
    );
};
