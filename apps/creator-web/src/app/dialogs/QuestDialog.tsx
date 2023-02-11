import { QuestRewardItem, QuestSchema } from '@bananos/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete, FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { DataGrid, GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import _ from 'lodash';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PackageContext } from '../contexts';
import { DialogContext, Dialogs } from '../contexts/dialogContext';
import { QuestsContext } from '../views/quests/QuestsContextProvider';

import styles from './QuestDialog.module.scss';

const DefaultQuest = {
    id: '',
    name: '',
    description: '',
    stages: {},
    questReward: {
        experience: 0,
        currency: 0,
        items: {},
    },
};

export const QuestDialog = () => {
    const packageContext = useContext(PackageContext);
    const { activeDialog, setActiveDialog } = useContext(DialogContext);
    const { activeQuest, createQuest } = useContext(QuestsContext);
    const [quest, setQuest] = useState<QuestSchema>(Object.assign({}, DefaultQuest) as QuestSchema);
    const itemRewardSelect = useRef();

    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ? packageContext?.backendStore?.itemTemplates?.data : {};

    useEffect(() => {
        if (activeDialog === Dialogs.QuestDialog && activeQuest === null) {
            setQuest(Object.assign({}, DefaultQuest) as QuestSchema);
        }

        if (activeDialog === Dialogs.QuestDialog && activeQuest !== null) {
            setQuest(activeQuest);
        }
    }, [activeDialog === Dialogs.ItemDialog, activeQuest]);

    const changeValue = useCallback(
        (prop: string, value: string | number) => {
            const path = prop.split('.');
            const toUpdate: Record<string, any> = {};
            let nested = toUpdate;

            for (let i = 0; i < path.length - 1; i++) {
                nested[path[i]] = {};
                nested = nested[path[i]];
            }
            nested[path[path.length - 1]] = value;

            setQuest(_.merge({}, quest, toUpdate));
        },
        [quest]
    );

    const confirmAction = useCallback(() => {
        if (activeQuest) {
        } else {
            createQuest(quest);
            //    updateItemTemplate(itemTemplate);
        }
        setActiveDialog(null);
    }, [quest, activeQuest]);

    return (
        <Dialog open={activeDialog === Dialogs.QuestDialog} onClose={() => setActiveDialog(null)}>
            <DialogTitle>Create Quest</DialogTitle>
            <DialogContent>
                <TextField value={quest.name} onChange={(e) => changeValue('name', e.target.value)} margin="dense" label="Name" fullWidth variant="standard" />
                <TextField
                    value={quest.description}
                    onChange={(e) => changeValue('description', e.target.value)}
                    margin="dense"
                    label="Description"
                    fullWidth
                    multiline
                    variant="standard"
                />
                <TextField
                    value={quest.questReward.experience}
                    onChange={(e) => changeValue('questReward.experience', parseInt(e.target.value))}
                    margin="dense"
                    label="Experience"
                    type="number"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    value={quest.questReward.currency}
                    onChange={(e) => changeValue('questReward.currency', parseInt(e.target.value))}
                    margin="dense"
                    label="Money (in coppers)"
                    fullWidth
                    variant="standard"
                    type="number"
                />
                <FormControl fullWidth margin="dense">
                    <Autocomplete
                        ref={itemRewardSelect}
                        onChange={(_, element) => {
                            if (element) {
                                setQuest({
                                    ...quest,
                                    questReward: { ...quest.questReward, items: { ...(quest.questReward.items ?? {}), [element.id]: { itemTemplateId: element.id, amount: 1 } } },
                                });
                            }
                        }}
                        options={_.map(
                            _.filter(itemTemplates, (item) => !quest.questReward.items?.[item.id]),
                            (template) => ({ label: template.name, id: template.id })
                        )}
                        renderInput={(params) => <TextField {...params} value={undefined} label="Items" />}
                    />
                </FormControl>

                <div className={styles['item-reward']}>
                    <DataGrid
                        disableSelectionOnClick
                        rows={_.map(quest.questReward.items, item => item) ?? []}
                        getRowId={(row) => row.itemTemplateId}
                        experimentalFeatures={{ newEditingApi: true }}
                        processRowUpdate={(newRow: QuestRewardItem) => {
                            setQuest({
                                ...quest,
                                questReward: {
                                    ...quest.questReward,
                                    items: _.mapValues(quest.questReward.items, (item => {
                                        if (item.itemTemplateId === newRow.itemTemplateId) {
                                            return { ...item, amount: newRow.amount };
                                        }
                                        return item;
                                    })),
                                },
                            });
                            return newRow;
                        }}
                        columns={[
                            {
                                field: 'Image',
                                headerName: 'Image',
                                width: 54,
                                renderCell: (params: GridRenderCellParams<QuestRewardItem>) => {
                                    return <img className={styles['item-image-preview']} src={itemTemplates[params.id].image} />;
                                },
                            },
                            {
                                field: 'name',
                                headerName: 'Item Name',
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<QuestRewardItem>) => {
                                    return itemTemplates[params.id].name;
                                },
                            },
                            {
                                field: 'amount',
                                headerName: 'Amount',
                                type: 'number',
                                flex: 1,
                                editable: true,
                            },
                            {
                                field: 'actions',
                                headerName: 'Actions',
                                type: 'actions',
                                width: 80,
                                getActions: ({ id }) => {
                                    return [
                                        <GridActionsCellItem
                                            label="Delete"
                                            icon={<DeleteIcon />}
                                            onClick={() => {
                                                setQuest({
                                                    ...quest,
                                                    questReward: {
                                                        ...quest.questReward,
                                                        items: _.pickBy(quest.questReward.items, (item) => item.itemTemplateId !== id),
                                                    },
                                                });
                                            }}
                                        />,
                                    ];
                                },
                            },
                        ]}
                        pageSize={3}
                        density="compact"
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={confirmAction} variant="contained">
                    {activeQuest ? 'Update' : 'Create'}
                </Button>
                <Button onClick={() => setActiveDialog(null)} variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
