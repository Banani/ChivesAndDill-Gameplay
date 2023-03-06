import { QuoteHandler } from '@bananos/types';
import { Box, Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import _ from 'lodash';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { FormContext, FormContextProvider, FormFieldConditions, Schema, SchemaFieldType } from '../../contexts/FormContext';
import { CharacterContext } from '../../views/monsterPanel/CharacterContextProvider';
import { CharacterQuotes } from '../shared';
import { NpcDefaultStep, NpcQuests } from './components';
import { ItemStock } from './components/ItemStock';

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
    const { activeCharacterTemplate } = useContext(CharacterContext);

    const schema: Schema = useMemo(() => {
        const defaultValues = activeCharacterTemplate?.id ? activeCharacterTemplate : DefaultNpcTemplate;
        return {
            name: {
                type: SchemaFieldType.Text,
                conditions: [{ type: FormFieldConditions.Required }],
                defaultValue: defaultValues.name
            },
            healthPoints: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.healthPoints,
            },
            healthPointsRegeneration: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.healthPointsRegeneration,
            },
            spellPower: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.spellPower,
            },
            spellPowerRegeneration: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.spellPowerRegeneration,
            },
            movementSpeed: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.movementSpeed,
            },
            stock: {
                type: SchemaFieldType.Record,
                defaultValue: defaultValues.stock
            },
            quests: {
                type: SchemaFieldType.Record,
                defaultValue: defaultValues.quests
            },
            quotesEvents: {
                type: SchemaFieldType.Record,
                schema: {
                    chance: {
                        type: SchemaFieldType.Number,
                        conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.Range, min: 0, max: 100 }],
                    },
                    quotes: {
                        type: SchemaFieldType.Array,
                        newElement: ""
                    }
                },
                defaultValue: defaultValues.quotesEvents
            }
        }
    }, [activeCharacterTemplate, DefaultNpcTemplate])

    return <FormContextProvider schema={schema}><NpcTemplateDialogContent /></FormContextProvider>
}

const NpcTemplateDialogContent = () => {
    const { activeDialog, setActiveDialog } = useContext(DialogContext);
    const { createCharacterTemplate, setActiveCharacterTemplate, activeCharacterTemplate, updateCharacterTemplate } = useContext(CharacterContext);
    const { errors, setFormDirty, resetForm, getFieldValue, values } = useContext(FormContext);

    const [activeTab, setActiveTab] = useState<NpcTemplateDialogTabs>(NpcTemplateDialogTabs.Default);

    const changeActiveTab = (event: React.SyntheticEvent, newValue: NpcTemplateDialogTabs) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        if (activeDialog === Dialogs.NpcTemplateDialogs && !activeCharacterTemplate?.id) {
            setActiveCharacterTemplate(Object.assign({}, DefaultNpcTemplate));
        }
    }, [activeDialog === Dialogs.NpcTemplateDialogs, activeCharacterTemplate?.id]);

    useEffect(() => {
        if (activeDialog !== Dialogs.NpcTemplateDialogs) {
            setActiveCharacterTemplate(null);
            resetForm();
        }
    }, [activeDialog !== Dialogs.NpcTemplateDialogs]);


    const confirmAction = useCallback(() => {
        if (_.filter(errors, err => err != '').length > 0) {
            setFormDirty();
            return;
        }

        if (!activeCharacterTemplate) {
            return;
        }

        const quotesEvents = _.mapValues(getFieldValue('quotesEvents'), (quoteEvent: QuoteHandler) => ({
            ...quoteEvent,
            quotes: quoteEvent.quotes.filter(text => text != "")
        }));

        const newNpcTemplate = {
            ...activeCharacterTemplate,
            ...values,
            quotesEvents
        };

        if (activeCharacterTemplate.id) {
            updateCharacterTemplate(newNpcTemplate);
        } else {
            createCharacterTemplate(newNpcTemplate);
        }
        setActiveDialog(null);
    }, [activeCharacterTemplate, setFormDirty, updateCharacterTemplate, createCharacterTemplate, errors, values, getFieldValue]);

    if (!activeCharacterTemplate) {
        return null;
    }

    return (
        <Dialog open={activeDialog === Dialogs.NpcTemplateDialogs} onClose={() => setActiveDialog(null)} maxWidth="xl">
            <DialogTitle>{activeCharacterTemplate.id ? 'Update' : 'Create'} Npc Template</DialogTitle>
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
                    {activeTab === NpcTemplateDialogTabs.Default ? <NpcDefaultStep /> : null}
                </div>
                <div role="tabpanel" hidden={activeTab !== NpcTemplateDialogTabs.Stock} aria-labelledby={NpcTemplateDialogTabs.Stock}>
                    {activeTab === NpcTemplateDialogTabs.Stock ? <ItemStock /> : null}
                </div>
                <div role="tabpanel" hidden={activeTab !== NpcTemplateDialogTabs.Quests} aria-labelledby={NpcTemplateDialogTabs.Quests}>
                    {activeTab === NpcTemplateDialogTabs.Quests ? <NpcQuests /> : null}
                </div>
                <div role="tabpanel" hidden={activeTab !== NpcTemplateDialogTabs.Quotes} aria-labelledby={NpcTemplateDialogTabs.Quotes}>
                    {activeTab === NpcTemplateDialogTabs.Quotes ? <CharacterQuotes /> : null}
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={confirmAction}
                    variant="contained"
                >
                    {activeCharacterTemplate.id ? 'Update' : 'Create'}
                </Button>
                <Button onClick={() => setActiveDialog(null)} variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
