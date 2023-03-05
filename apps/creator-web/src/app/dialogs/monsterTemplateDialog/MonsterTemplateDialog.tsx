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
import { MonsterDefaultStep } from './components';
import { MonsterLoot } from './components/MonsterLoot';

import styles from './MonsterTemplateDialog.module.scss';

enum MonsterTemplateDialogTabs {
    Default = 'Default',
    Loot = 'Loot',
    Spells = 'Spells',
    Quotes = "Quotes"
}

const DefaultMonsterTemplate = {
    id: '',
    name: '',
    healthPoints: 100,
    healthPointsRegeneration: 5,
    spellPower: 100,
    spellPowerRegeneration: 5,
    movementSpeed: 8,
    sightRange: 100,
    desiredRange: 10,
    escapeRange: 1000,
    attackFrequency: 1000,
    dropSchema: {
        coins: {},
        items: {}
    },
    quests: {},
    npcRespawns: [],
    quotesEvents: {
        standard: { chance: 1, quotes: [""] },
        onDying: { chance: 1, quotes: [""] },
        onKilling: { chance: 1, quotes: [""] },
        onPulling: { chance: 1, quotes: [""] }
    }
};

export const MonsterTemplateDialog = () => {
    const { activeCharacterTemplate } = useContext(CharacterContext);

    const schema: Schema = useMemo(() => {
        const defaultValues = activeCharacterTemplate?.id ? activeCharacterTemplate : DefaultMonsterTemplate;

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
            sightRange: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.sightRange,
            },
            desiredRange: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.desiredRange,
            },
            escapeRange: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.escapeRange,
            },
            attackFrequency: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.attackFrequency,
            },
            dropSchema: {
                type: SchemaFieldType.Object,
                schema: {
                    coins: {
                        type: SchemaFieldType.Object,
                        schema: {
                            dropChance: {
                                type: SchemaFieldType.Number,
                                conditions: [{
                                    type: FormFieldConditions.Required
                                },
                                { type: FormFieldConditions.Number },
                                { type: FormFieldConditions.Range, min: 0, max: 100 }
                                ],
                            },
                            maxAmount: {
                                type: SchemaFieldType.Number,
                                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                            },
                            minAmount: {
                                type: SchemaFieldType.Number,
                                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                            },
                            itemTemplateId: {
                                type: SchemaFieldType.Text,
                            }
                        }
                    },
                    items: {
                        type: SchemaFieldType.Record,
                        schema: {
                            dropChance: {
                                type: SchemaFieldType.Number,
                                conditions: [{
                                    type: FormFieldConditions.Required
                                },
                                { type: FormFieldConditions.Number },
                                { type: FormFieldConditions.Range, min: 0, max: 100 }
                                ],
                            },
                            maxAmount: {
                                type: SchemaFieldType.Number,
                                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                            },
                            minAmount: {
                                type: SchemaFieldType.Number,
                                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                            },
                            itemTemplateId: {
                                type: SchemaFieldType.Text,
                            }
                        }
                    }
                },
                defaultValue: defaultValues.dropSchema,
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
    }, [activeCharacterTemplate, DefaultMonsterTemplate])

    return <FormContextProvider schema={schema}><MonsterTemplateDialogContent /></FormContextProvider>
}

const MonsterTemplateDialogContent = () => {
    const { activeDialog, setActiveDialog } = useContext(DialogContext);
    const { createCharacterTemplate, setActiveCharacterTemplate, activeCharacterTemplate, updateCharacterTemplate } = useContext(CharacterContext);
    const { errors, setFormDirty, resetForm, getFieldValue, values } = useContext(FormContext);

    const [activeTab, setActiveTab] = useState<MonsterTemplateDialogTabs>(MonsterTemplateDialogTabs.Default);

    const changeActiveTab = (event: React.SyntheticEvent, newValue: MonsterTemplateDialogTabs) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        if (activeDialog === Dialogs.MonsterTemplateDialog && !activeCharacterTemplate?.id) {
            setActiveCharacterTemplate(Object.assign({}, DefaultMonsterTemplate));
        }
    }, [activeDialog === Dialogs.MonsterTemplateDialog, activeCharacterTemplate?.id]);

    useEffect(() => {
        if (activeDialog !== Dialogs.MonsterTemplateDialog) {
            setActiveCharacterTemplate(null);
            resetForm();
        }
    }, [activeDialog !== Dialogs.MonsterTemplateDialog]);


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

        const newCharacterTemplate = {
            ...activeCharacterTemplate,
            ...values,
            quotesEvents
        };

        if (activeCharacterTemplate.id) {
            updateCharacterTemplate(newCharacterTemplate);
        } else {
            createCharacterTemplate(newCharacterTemplate);
        }
        setActiveDialog(null);
    }, [activeCharacterTemplate, setFormDirty, updateCharacterTemplate, createCharacterTemplate, errors, values, getFieldValue]);

    if (!activeCharacterTemplate) {
        return null;
    }

    return (
        <Dialog open={activeDialog === Dialogs.MonsterTemplateDialog} onClose={() => setActiveDialog(null)} maxWidth="xl">
            <DialogTitle>{activeCharacterTemplate.id ? 'Update' : 'Create'} Monster Template</DialogTitle>
            <DialogContent className={styles['dialog']}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={changeActiveTab}>
                        <Tab label="Details" aria-controls={MonsterTemplateDialogTabs.Default} value={MonsterTemplateDialogTabs.Default} />
                        <Tab label="Loot" aria-controls={MonsterTemplateDialogTabs.Loot} value={MonsterTemplateDialogTabs.Loot} />
                        <Tab label="Spells" aria-controls={MonsterTemplateDialogTabs.Spells} value={MonsterTemplateDialogTabs.Spells} />
                        <Tab label="Quotes" aria-controls={MonsterTemplateDialogTabs.Quotes} value={MonsterTemplateDialogTabs.Quotes} />
                    </Tabs>
                </Box>

                <div role="tabpanel" hidden={activeTab !== MonsterTemplateDialogTabs.Default} aria-labelledby={MonsterTemplateDialogTabs.Default}>
                    {activeTab === MonsterTemplateDialogTabs.Default ? <MonsterDefaultStep /> : null}
                </div>
                <div role="tabpanel" hidden={activeTab !== MonsterTemplateDialogTabs.Loot} aria-labelledby={MonsterTemplateDialogTabs.Loot}>
                    {activeTab === MonsterTemplateDialogTabs.Loot ? <MonsterLoot /> : null}
                </div>
                <div role="tabpanel" hidden={activeTab !== MonsterTemplateDialogTabs.Spells} aria-labelledby={MonsterTemplateDialogTabs.Spells}>
                    {/* {activeTab === MonsterTemplateDialogTabs.Quests ? <CharacterQuests /> : null} */}
                </div>
                <div role="tabpanel" hidden={activeTab !== MonsterTemplateDialogTabs.Quotes} aria-labelledby={MonsterTemplateDialogTabs.Quotes}>
                    {activeTab === MonsterTemplateDialogTabs.Quotes ? <CharacterQuotes /> : null}
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
