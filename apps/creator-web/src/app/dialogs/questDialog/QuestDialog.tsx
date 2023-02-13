import { AllQuestStagePart, KillingQuestStagePart, KillingQuestStagePartComparison, MovementQuestStagePart, QuestSchema, QuestStage, QuestType } from '@bananos/types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import _, { forEach } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { QuestsContext } from '../../views/quests/QuestsContextProvider';

import classnames from 'classnames';
import { Label } from '../../components';
import { PackageContext } from '../../contexts';
import { QuestConditions } from './QuestConditions';
import styles from "./QuestDialog.module.scss";
import { QuestRewards } from './QuestRewards';

export const customMerge = (data: any, pathToUpdate: any) => {
    forEach(pathToUpdate, (toUpdate, key) => {
        if (typeof toUpdate === 'object' && toUpdate !== null) {
            // to jest po to jesli obiekt zmieni typ, najpierw bedzie liczba, potem nagle obiektem
            if (typeof data[key] !== 'object' || data[key] === null) {
                data[key] = {};
            }

            if (Array.isArray(pathToUpdate[key])) {
                data[key] = toUpdate;
            } else {
                customMerge(data[key], pathToUpdate[key]);
            }
        } else {
            data[key] = toUpdate;
        }
    });
    return data;
};

enum QuestDialogTabs {
    Default = 'Default',
    Reward = 'Reward',
    Conditions = 'Conditions',
}

const DefaultMovementSubstage: MovementQuestStagePart = {
    id: "",
    questId: "",
    stageId: "",
    type: QuestType.MOVEMENT,
    locationName: "",
    targetLocation: { x: 0, y: 0 },
    acceptableRange: 200
}

const DefaultKillingSubstage: KillingQuestStagePart = {
    id: "",
    questId: "",
    stageId: "",
    type: QuestType.KILLING,
    monsterName: "",
    rule: [{
        fieldName: "characterTemplateId",
        comparison: KillingQuestStagePartComparison.equality,
        value: ""
    }],
    amount: 0
}

const substagesMap: Record<QuestType, AllQuestStagePart> = {
    [QuestType.MOVEMENT]: DefaultMovementSubstage,
    [QuestType.KILLING]: DefaultKillingSubstage
}

const DefaultStage: QuestStage = {
    id: "",
    description: '',
    stageParts: {
        '2': _.cloneDeep(DefaultMovementSubstage)
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
    const { activeDialog, setActiveDialog } = useContext(DialogContext);
    const { activeQuest, createQuest, setActiveQuest } = useContext(QuestsContext);
    const [idCounter, setIdCounter] = useState(10);

    const packageContext = useContext(PackageContext);
    const npcTemplates = packageContext?.backendStore?.npcTemplates?.data ?? {};

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

            let output = {};
            customMerge(output, activeQuest);
            customMerge(output, toUpdate);
            setActiveQuest(output as QuestSchema);
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

    const addStage = useCallback(() => {
        if (!activeQuest) {
            return;
        }

        setActiveQuest({ ...activeQuest, stages: { ...activeQuest.stages, [idCounter]: _.cloneDeep(DefaultStage) } });
        setIdCounter(prev => prev + 1);
    }, [activeQuest, idCounter]);

    const removeStage = useCallback((stageId: string) => {
        if (!activeQuest) {
            return;
        }

        setActiveQuest({ ...activeQuest, stages: _.pickBy(activeQuest.stages, (_, key) => key !== stageId) });
    }, [activeQuest]);


    const addSubstage = useCallback((stageId: string) => {
        const newQuest = _.cloneDeep(activeQuest);
        if (!newQuest || !newQuest.stages) {
            return;
        }

        newQuest.stages[stageId].stageParts[idCounter] = _.cloneDeep(DefaultMovementSubstage)

        setActiveQuest(newQuest);
        setIdCounter(prev => prev + 1);
    }, [activeQuest, idCounter]);

    const removeSubstage = useCallback((stageId: string, substageId: string) => {
        if (!activeQuest || !activeQuest.stages) {
            return;
        }

        setActiveQuest({
            ...activeQuest, stages: {
                ...activeQuest.stages, [stageId]: {
                    ...activeQuest.stages[stageId],
                    stageParts: _.pickBy(activeQuest.stages[stageId].stageParts, (_, key) => key !== substageId)
                }
            }
        });
    }, [activeQuest]);

    if (!activeQuest) {
        return null;
    }

    let stageNumber = 1;
    let substageNumber = 1;

    return (
        <Dialog open={activeDialog === Dialogs.QuestDialog} onClose={() => setActiveDialog(null)} maxWidth="xl" className={styles['dialog']}>
            <DialogTitle>Create Quest</DialogTitle>
            <DialogContent className={styles['dialog-content']}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={changeActiveTab} aria-label="basic tabs example">
                        <Tab label="Details" aria-controls={QuestDialogTabs.Default} value={QuestDialogTabs.Default} />
                        <Tab label="Rewards" aria-controls={QuestDialogTabs.Reward} value={QuestDialogTabs.Reward} />
                        <Tab label="Conditions" aria-controls={QuestDialogTabs.Conditions} value={QuestDialogTabs.Conditions} />
                    </Tabs>
                </Box>
                <div role="tabpanel" hidden={activeTab !== QuestDialogTabs.Default} aria-labelledby={QuestDialogTabs.Default}>
                    <TextField value={activeQuest.name} onChange={(e) => changeValue('name', e.target.value)} margin="dense" label="Name" fullWidth variant="standard" />
                    <TextField
                        value={activeQuest.description}
                        onChange={(e) => changeValue('description', e.target.value)}
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        variant="standard"
                    />
                    {_.map(activeQuest.stages ?? {}, (stages, stageKey: string) => {
                        return <div key={stageKey}>
                            <div className={styles['element-header']} key={stageKey}>
                                <Label>Stage: {stageNumber++}</Label>
                                <IconButton
                                    onClick={() => removeStage(stageKey)}
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </div>
                            <hr className={styles['line']} />
                            <TextField
                                value={activeQuest.stages?.[stageKey].description}
                                onChange={(e) => changeValue(`stages.${stageKey}.description`, e.target.value)}
                                margin="dense"
                                label="Stage description"
                                fullWidth
                                multiline
                                variant="standard"
                            />
                            {_.map(stages.stageParts ?? {}, (stagePart, substageKey) => {
                                return <div key={substageKey}>
                                    <div className={styles['substage-panel']}>
                                        <div className={styles['element-header']}>
                                            <Label>Substage: {substageNumber++}</Label>
                                            <IconButton
                                                onClick={() => removeSubstage(stageKey, substageKey)}
                                            >
                                                <DeleteForeverIcon />
                                            </IconButton >
                                        </div>
                                        <hr className={styles['line']} />
                                    </div>
                                    <div className={styles['substage-wrapper']}>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel id={"substage-type-" + substageKey}>Substage Type</InputLabel>
                                            <Select
                                                labelId={"substage-type-" + substageKey}
                                                value={stagePart.type}
                                                label="Substage Type"
                                                onChange={(e) => {
                                                    const currentQuest = _.cloneDeep(activeQuest);
                                                    if (!currentQuest.stages) {
                                                        return;
                                                    }

                                                    currentQuest.stages[stageKey].stageParts[substageKey] = _.cloneDeep(substagesMap[e.target.value as QuestType]);
                                                    setActiveQuest(currentQuest);
                                                }}
                                            >
                                                <MenuItem value={QuestType.MOVEMENT}>Go to place</MenuItem>
                                                <MenuItem value={QuestType.KILLING}>Kill monster</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {activeQuest.stages?.[stageKey].stageParts[substageKey].type === QuestType.MOVEMENT ? <>
                                            <TextField
                                                value={(activeQuest.stages?.[stageKey].stageParts[substageKey] as MovementQuestStagePart).locationName}
                                                onChange={(e) => changeValue(`stages.${stageKey}.stageParts.${substageKey}.locationName`, e.target.value)}
                                                margin="dense"
                                                label="Location Name"
                                                fullWidth
                                                variant="standard"
                                            />
                                            <TextField
                                                value={(activeQuest.stages?.[stageKey].stageParts[substageKey] as MovementQuestStagePart).acceptableRange}
                                                onChange={(e) => changeValue(`stages.${stageKey}.stageParts.${substageKey}.acceptableRange`, parseInt(e.target.value))}
                                                margin="dense"
                                                label="Acceptable range"
                                                fullWidth
                                                type="number"
                                                variant="standard"
                                            />
                                            <TextField
                                                value={(activeQuest.stages?.[stageKey].stageParts[substageKey] as MovementQuestStagePart).targetLocation.x}
                                                onChange={(e) => changeValue(`stages.${stageKey}.stageParts.${substageKey}.targetLocation.x`, parseInt(e.target.value))}
                                                margin="dense"
                                                label="Location: X"
                                                fullWidth
                                                type="number"
                                                variant="standard"
                                            />
                                            <TextField
                                                value={(activeQuest.stages?.[stageKey].stageParts[substageKey] as MovementQuestStagePart).targetLocation.y}
                                                onChange={(e) => changeValue(`stages.${stageKey}.stageParts.${substageKey}.targetLocation.y`, parseInt(e.target.value))}
                                                margin="dense"
                                                label="Location: Y"
                                                fullWidth
                                                type="number"
                                                variant="standard"
                                            /></> : null
                                        }

                                        {activeQuest.stages?.[stageKey].stageParts[substageKey].type === QuestType.KILLING ? <>
                                            <FormControl fullWidth margin="dense">
                                                <InputLabel id={"monster-selector-" + substageKey}>Monster</InputLabel>
                                                <Select
                                                    labelId={"monster-selector-" + substageKey}
                                                    value={(activeQuest.stages?.[stageKey].stageParts[substageKey] as KillingQuestStagePart).rule[0].value}
                                                    label="Monster"
                                                    onChange={(e) => {
                                                        changeValue(`stages.${stageKey}.stageParts.${substageKey}.rule.0.value`, e.target.value)
                                                        changeValue(`stages.${stageKey}.stageParts.${substageKey}.monsterName`, npcTemplates[e.target.value].name)
                                                    }}
                                                >
                                                    {_.map(npcTemplates, npcTemplate => (
                                                        <MenuItem key={npcTemplate.id} value={npcTemplate.id}>{npcTemplate.name}</MenuItem>
                                                    ))}

                                                </Select>
                                            </FormControl>
                                            <TextField
                                                value={(activeQuest.stages?.[stageKey].stageParts[substageKey] as KillingQuestStagePart).monsterName}
                                                onChange={(e) => changeValue(`stages.${stageKey}.stageParts.${substageKey}.monsterName`, e.target.value)}
                                                margin="dense"
                                                label="Monster name"
                                                fullWidth
                                                variant="standard"
                                            />
                                            <TextField
                                                value={(activeQuest.stages?.[stageKey].stageParts[substageKey] as KillingQuestStagePart).amount}
                                                onChange={(e) => changeValue(`stages.${stageKey}.stageParts.${substageKey}.amount`, parseInt(e.target.value))}
                                                margin="dense"
                                                label="Amount"
                                                fullWidth
                                                type="number"
                                                variant="standard"
                                            /></> : null
                                        }
                                    </div>
                                </div>
                            })}
                            <div className={classnames({ [styles['creation-button-holder']]: true, [styles['substage-panel']]: true })}>
                                <Button variant="outlined" onClick={() => addSubstage(stageKey)}>Add Substage</Button>
                            </div>
                        </div>
                    })}
                    <div className={styles['creation-button-holder']}>
                        <Button variant="outlined" onClick={addStage}>Add Stage</Button>
                    </div>
                </div>
                <div role="tabpanel" hidden={activeTab !== QuestDialogTabs.Reward} aria-labelledby={QuestDialogTabs.Reward}>
                    {activeTab === QuestDialogTabs.Reward ? <QuestRewards /> : null}
                </div>
                <div role="tabpanel" hidden={activeTab !== QuestDialogTabs.Conditions} aria-labelledby={QuestDialogTabs.Conditions}>
                    {activeTab === QuestDialogTabs.Conditions ? <QuestConditions /> : null}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={confirmAction} variant="contained">
                    {activeQuest.id ? 'Update' : 'Create'}
                </Button>
                <Button onClick={() => setActiveDialog(null)} variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog >
    );
};
