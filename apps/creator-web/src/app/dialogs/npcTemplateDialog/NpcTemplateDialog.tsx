import { Box, Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { NpcContext } from '../../views/npcPanel/NpcContextProvider';
import { ItemStock } from './ItemStock';
import { NpcQuests } from './NpcQuests';
import { NpcQuotes } from './NpcQuotes';

import styles from './NpcTemplateDialog.module.scss';

enum NpcTemplateDialogTabs {
    Default = 'Default',
    Stock = 'Stock',
    Quests = 'Quests',
    Quotes = "Quotes"
}

const DefaultNpcTemplate = {
    id: '',
    name: '',
    healthPoints: 100,
    healthPointsRegeneration: 5,
    spellPower: 100,
    spellPowerRegeneration: 5,
    movementSpeed: 8,
    stock: {},
    quests: {},
    npcRespawns: [],
    quotesEvents: {
        standard: { chance: 1, quotes: [""] },
        onDying: { chance: 1, quotes: [""] }
    }
};

export const NpcTemplateDialog = () => {
    const { activeDialog, setActiveDialog } = useContext(DialogContext);
    const { createNpcTemplate, setActiveNpcTemplate, activeNpcTemplate, updateNpcTemplate } = useContext(NpcContext);

    const [activeTab, setActiveTab] = useState<NpcTemplateDialogTabs>(NpcTemplateDialogTabs.Default);

    const changeActiveTab = (event: React.SyntheticEvent, newValue: NpcTemplateDialogTabs) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        if (activeDialog === Dialogs.NpcTemplateDialogs && !activeNpcTemplate?.id) {
            setActiveNpcTemplate(Object.assign({}, DefaultNpcTemplate));
        }
    }, [activeDialog === Dialogs.NpcTemplateDialogs, activeNpcTemplate?.id]);

    useEffect(() => {
        if (activeDialog !== Dialogs.NpcTemplateDialogs) {
            setActiveNpcTemplate(null);
        }
    }, [activeDialog !== Dialogs.NpcTemplateDialogs]);

    const changeValue = useCallback(
        (prop: string, value: string | number) => {
            if (!activeNpcTemplate) {
                return;
            }

            setActiveNpcTemplate({ ...activeNpcTemplate, [prop]: value });
        },
        [activeNpcTemplate]
    );

    const confirmAction = useCallback(() => {
        if (!activeNpcTemplate) {
            return;
        }

        if (activeNpcTemplate.id) {
            updateNpcTemplate(activeNpcTemplate);
        } else {
            createNpcTemplate(activeNpcTemplate);
        }
        setActiveDialog(null);
    }, [activeNpcTemplate]);

    if (!activeNpcTemplate) {
        return null;
    }

    return (
        <Dialog open={activeDialog === Dialogs.NpcTemplateDialogs} onClose={() => setActiveDialog(null)} maxWidth="xl">
            <DialogTitle>Create Npc Template</DialogTitle>
            <DialogContent className={styles['dialog']}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={changeActiveTab} aria-label="basic tabs example">
                        <Tab label="Details" aria-controls={NpcTemplateDialogTabs.Default} value={NpcTemplateDialogTabs.Default} />
                        <Tab label="Stock" aria-controls={NpcTemplateDialogTabs.Stock} value={NpcTemplateDialogTabs.Stock} />
                        <Tab label="Quests" aria-controls={NpcTemplateDialogTabs.Quests} value={NpcTemplateDialogTabs.Quests} />
                        <Tab label="Quotes" aria-controls={NpcTemplateDialogTabs.Quotes} value={NpcTemplateDialogTabs.Quotes} />
                    </Tabs>
                </Box>

                <div role="tabpanel" hidden={activeTab !== NpcTemplateDialogTabs.Default} aria-labelledby={NpcTemplateDialogTabs.Default}>
                    <TextField
                        value={activeNpcTemplate.name}
                        onChange={(e) => changeValue('name', e.target.value)}
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        value={activeNpcTemplate.healthPoints}
                        onChange={(e) => changeValue('healthPoints', parseInt(e.target.value))}
                        margin="dense"
                        label="Health Points"
                        fullWidth
                        variant="standard"
                        type="number"
                    />
                    <TextField
                        value={activeNpcTemplate.healthPointsRegeneration}
                        onChange={(e) => changeValue('healthPointsRegeneration', parseInt(e.target.value))}
                        margin="dense"
                        label="Health Points Regeneration"
                        fullWidth
                        variant="standard"
                        type="number"
                    />
                    <TextField
                        value={activeNpcTemplate.spellPower}
                        onChange={(e) => changeValue('spellPower', parseInt(e.target.value))}
                        margin="dense"
                        label="Spell Power"
                        fullWidth
                        variant="standard"
                        type="number"
                    />
                    <TextField
                        value={activeNpcTemplate.spellPowerRegeneration}
                        onChange={(e) => changeValue('spellPowerRegeneration', parseInt(e.target.value))}
                        margin="dense"
                        label="Spell Power Regeneration"
                        fullWidth
                        variant="standard"
                        type="number"
                    />
                    <TextField
                        value={activeNpcTemplate.movementSpeed}
                        onChange={(e) => changeValue('movementSpeed', parseInt(e.target.value))}
                        margin="dense"
                        label="Movement Speed"
                        fullWidth
                        variant="standard"
                        type="number"
                    />
                </div>
                <div role="tabpanel" hidden={activeTab !== NpcTemplateDialogTabs.Stock} aria-labelledby={NpcTemplateDialogTabs.Stock}>
                    <ItemStock />
                </div>
                <div role="tabpanel" hidden={activeTab !== NpcTemplateDialogTabs.Quests} aria-labelledby={NpcTemplateDialogTabs.Quests}>
                    <NpcQuests />
                </div>
                <div role="tabpanel" hidden={activeTab !== NpcTemplateDialogTabs.Quotes} aria-labelledby={NpcTemplateDialogTabs.Quotes}>
                    <NpcQuotes quoteEvents={activeNpcTemplate.quotesEvents ?? {}} updateQuoteEvents={quoteEvents => setActiveNpcTemplate({ ...activeNpcTemplate, quotesEvents: quoteEvents })} />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={confirmAction}
                    variant="contained"
                >
                    {activeNpcTemplate.id ? 'Update' : 'Create'}
                </Button>
                <Button onClick={() => setActiveDialog(null)} variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog >
    );
};
