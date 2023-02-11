import { QuestSchema } from '@bananos/types';
import { Box, Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { QuestsContext } from '../../views/quests/QuestsContextProvider';
import { QuestRewards } from './QuestRewards';

import styles from "./QuestDialog.module.scss";

enum QuestDialogTabs {
    Default = 'Default',
    Reward = 'Reward',
    Conditions = 'Conditions',
}

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
    const { activeDialog, setActiveDialog } = useContext(DialogContext);
    const { activeQuest, createQuest, setActiveQuest } = useContext(QuestsContext);

    const [activeTab, setActiveTab] = useState<QuestDialogTabs>(QuestDialogTabs.Default);

    const changeActiveTab = (event: React.SyntheticEvent, newValue: QuestDialogTabs) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        if (activeDialog === Dialogs.QuestDialog && activeQuest === null) {
            setActiveQuest(Object.assign({}, DefaultQuest) as QuestSchema);
        }
    }, [activeDialog === Dialogs.QuestDialog, activeQuest]);

    useEffect(() => {
        if (activeDialog !== Dialogs.QuestDialog) {
            setActiveQuest(null);
        }
    }, [activeDialog !== Dialogs.QuestDialog]);

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

            setActiveQuest(_.merge({}, activeQuest, toUpdate));
        },
        [activeQuest]
    );

    const confirmAction = useCallback(() => {
        if (activeQuest?.id) {
            //    updateItemTemplate(itemTemplate);
        } else {
            createQuest(activeQuest as QuestSchema);
        }
        setActiveDialog(null);
    }, [activeQuest, activeQuest]);



    return (
        <Dialog open={activeDialog === Dialogs.QuestDialog} onClose={() => setActiveDialog(null)} maxWidth="xl">
            <DialogTitle>Create Quest</DialogTitle>
            <DialogContent className={styles['dialog']}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={changeActiveTab} aria-label="basic tabs example">
                        <Tab label="Details" aria-controls={QuestDialogTabs.Default} value={QuestDialogTabs.Default} />
                        <Tab label="Rewards" aria-controls={QuestDialogTabs.Reward} value={QuestDialogTabs.Reward} />
                        <Tab label="Conditions" aria-controls={QuestDialogTabs.Conditions} value={QuestDialogTabs.Conditions} />
                    </Tabs>
                </Box>
                <div role="tabpanel" hidden={activeTab !== QuestDialogTabs.Default} aria-labelledby={QuestDialogTabs.Default}>
                    <TextField value={activeQuest?.name} onChange={(e) => changeValue('name', e.target.value)} margin="dense" label="Name" fullWidth variant="standard" />
                    <TextField
                        value={activeQuest?.description}
                        onChange={(e) => changeValue('description', e.target.value)}
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        variant="standard"
                    />
                </div>
                <div role="tabpanel" hidden={activeTab !== QuestDialogTabs.Reward} aria-labelledby={QuestDialogTabs.Reward}>
                    <QuestRewards />
                </div>
                <div role="tabpanel" hidden={activeTab !== QuestDialogTabs.Conditions} aria-labelledby={QuestDialogTabs.Conditions}>
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
