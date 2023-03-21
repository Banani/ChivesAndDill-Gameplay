import { AllQuestStagePart, QuestSchema, QuestStage, QuestType } from '@bananos/types';
import { Box, Tab, Tabs } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { QuestsContext } from '../../views/quests/QuestsContextProvider';

import { FormBuilder } from '../../components/formBuilder';
import { FormContextProvider, FormFieldConditions, Schema, SchemaFieldType } from '../../contexts/FormContext';
import { QuestActions } from './QuestActions';
import { QuestConditions } from './QuestConditions';
import styles from "./QuestDialog.module.scss";
import { QuestRewards } from './QuestRewards';

enum QuestDialogTabs {
    Default = 'Default',
    Reward = 'Reward',
    Conditions = 'Conditions',
}

const DefaultSubstage = {
    id: "",
    questId: "",
    stageId: "",
    type: QuestType.MOVEMENT,
    locationName: "",
    targetLocation: { x: 0, y: 0 },
    acceptableRange: 200,
    monsterName: "",
    // rule: [{
    //     fieldName: "characterTemplateId",
    //     comparison: KillingQuestStagePartComparison.equality,
    //     value: ""
    // }],
    amount: 0
}

const DefaultStage: QuestStage = {
    id: "",
    description: '',
    stageParts: {
        '2': _.cloneDeep(DefaultSubstage as AllQuestStagePart)
    }
}

const DefaultQuest: QuestSchema = {
    id: '',
    name: '',
    description: '',
    stages: {
        '1': _.cloneDeep(DefaultStage)
    },
    questReward: {
        experience: 0,
        currency: 0,
        items: {},
    },
    requiredLevel: 0,
    requiredQuests: {}
};

export const QuestDialog = () => {
    const { activeQuest, setActiveQuest } = useContext(QuestsContext);
    const defaultQuest = activeQuest?.id ? activeQuest : DefaultQuest;

    const conditionsSchema: Schema = useMemo(() => {
        return {
            requiredLevel: {
                label: "Required level",
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
                defaultValue: defaultQuest.requiredLevel
            },
            requiredQuests: {
                type: SchemaFieldType.Record,
                hidden: true,
                defaultValue: defaultQuest.requiredQuests
            }
        }
    }, [activeQuest]);

    const rewardsSchema: Schema = useMemo(() => {
        return {
            questReward: {
                type: SchemaFieldType.Object,
                defaultValue: defaultQuest.questReward,
                schema: {
                    experience: {
                        label: "Experience",
                        type: SchemaFieldType.Number,
                        conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
                    },
                    currency: {
                        label: "Money (in coppers)",
                        type: SchemaFieldType.Number,
                        conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
                    },
                    items: {
                        type: SchemaFieldType.Record,
                        hidden: true,
                        schema: {
                            amount: {
                                type: SchemaFieldType.Number,
                                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                            },
                            itemTemplateId: {
                                type: SchemaFieldType.Text,
                            }
                        }
                    }
                },
            },
        }
    }, [defaultQuest]);

    const defaultPartSchema: Schema = useMemo(() => {
        return {
            id: {
                type: SchemaFieldType.Text,
                defaultValue: defaultQuest.id,
                hidden: true
            },
            name: {
                label: "Name",
                type: SchemaFieldType.Text,
                conditions: [{ type: FormFieldConditions.Required }],
                defaultValue: defaultQuest.name
            },
            description: {
                label: "Description",
                type: SchemaFieldType.Text,
                defaultValue: defaultQuest.description,
                formFieldProps: { 'multiline': true }
            },
            stages: {
                label: "Stage",
                type: SchemaFieldType.Record,
                defaultValue: defaultQuest.stages,
                newElement: _.cloneDeep(DefaultStage),
                schema: {
                    id: {
                        type: SchemaFieldType.Text,
                        hidden: true
                    },
                    description: {
                        label: "Description",
                        type: SchemaFieldType.Text,
                        defaultValue: "",
                        formFieldProps: { 'multiline': true }
                    },
                    stageParts: {
                        label: "Substage",
                        type: SchemaFieldType.Record,
                        newElement: _.cloneDeep(DefaultSubstage),
                        schema: {
                            id: {
                                type: SchemaFieldType.Text,
                                hidden: true
                            },
                            questId: {
                                type: SchemaFieldType.Text,
                                hidden: true
                            },
                            stageId: {
                                type: SchemaFieldType.Text,
                                hidden: true
                            },
                            type: {
                                label: "Substage Type",
                                type: SchemaFieldType.Select,
                                options: [QuestType.MOVEMENT, QuestType.KILLING]
                            },
                            locationName: {
                                label: "Location Name",
                                type: SchemaFieldType.Text,
                                conditions: [{ type: FormFieldConditions.Required }],
                                prerequisite: ({ type }) => type === QuestType.MOVEMENT
                            },
                            targetLocation: {
                                type: SchemaFieldType.Object,
                                schema: {
                                    x: {
                                        label: "Location: X",
                                        type: SchemaFieldType.Number,
                                        conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                                    },
                                    y: {
                                        label: "Location: Y",
                                        type: SchemaFieldType.Number,
                                        conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                                    },
                                },
                                prerequisite: ({ type }) => type === QuestType.MOVEMENT
                            },
                            acceptableRange: {
                                label: "Acceptable Range",
                                type: SchemaFieldType.Number,
                                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
                                prerequisite: ({ type }) => type === QuestType.MOVEMENT
                            },
                            monsterName: {
                                label: "Monster Name",
                                type: SchemaFieldType.Text,
                                prerequisite: ({ type }) => type === QuestType.KILLING
                            },
                            amount: {
                                label: "Amount",
                                type: SchemaFieldType.Number,
                                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
                                prerequisite: ({ type }) => type === QuestType.KILLING
                            },
                        }
                    }
                }
            }
        };
    }, [defaultQuest]);

    const { activeDialog, setActiveDialog } = useContext(DialogContext);

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

    const wholeSchema = useMemo(() => ({ ...defaultPartSchema, ...rewardsSchema, ...conditionsSchema }), [defaultPartSchema, rewardsSchema, conditionsSchema]);

    if (!activeQuest) {
        return null;
    }

    return (
        <Dialog open={activeDialog === Dialogs.QuestDialog} onClose={() => setActiveDialog(null)} maxWidth="xl" className={styles['dialog']}>
            <FormContextProvider schema={wholeSchema}>
                <DialogTitle>{activeQuest?.id ? 'Update' : 'Create'} Quest</DialogTitle>
                <DialogContent className={styles['dialog-content']}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={activeTab} onChange={changeActiveTab} aria-label="basic tabs example">
                            <Tab label="Details" aria-controls={QuestDialogTabs.Default} value={QuestDialogTabs.Default} />
                            <Tab label="Rewards" aria-controls={QuestDialogTabs.Reward} value={QuestDialogTabs.Reward} />
                            <Tab label="Conditions" aria-controls={QuestDialogTabs.Conditions} value={QuestDialogTabs.Conditions} />
                        </Tabs>
                    </Box>
                    <div role="tabpanel" hidden={activeTab !== QuestDialogTabs.Default} aria-labelledby={QuestDialogTabs.Default}>
                        {activeTab === QuestDialogTabs.Default ? <>
                            <FormBuilder schema={defaultPartSchema} />
                        </> : null}
                    </div>
                    <div role="tabpanel" hidden={activeTab !== QuestDialogTabs.Reward} aria-labelledby={QuestDialogTabs.Reward}>
                        {activeTab === QuestDialogTabs.Reward ? <>
                            <FormBuilder schema={rewardsSchema} />
                            <QuestRewards />
                        </> : null}
                    </div>
                    <div role="tabpanel" hidden={activeTab !== QuestDialogTabs.Conditions} aria-labelledby={QuestDialogTabs.Conditions}>
                        {activeTab === QuestDialogTabs.Conditions ? <>
                            <FormBuilder schema={conditionsSchema} />
                            <QuestConditions />
                        </> : null}
                    </div>
                </DialogContent>
                <DialogActions>
                    <QuestActions />
                </DialogActions>
            </FormContextProvider>
        </Dialog >
    );
};
