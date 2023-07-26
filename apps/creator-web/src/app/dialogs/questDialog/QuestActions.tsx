import { KillingQuestStagePart, KillingQuestStagePartComparison, QuestSchema, QuestType } from "@bananos/types";
import { Button } from "@mui/material";
import _ from "lodash";
import { useCallback, useContext, useEffect } from "react";
import { FormContext } from "../../contexts/FormContext";
import { DialogContext, Dialogs } from "../../contexts/dialogContext";
import { QuestsContext } from "../../views/quests/QuestsContextProvider";

export const QuestActions = () => {
    const { setActiveDialog, activeDialog } = useContext(DialogContext);
    const { activeQuest, createQuest, updateQuest } = useContext(QuestsContext);
    const { getValues, values, errors, setFormDirty, resetForm } = useContext(FormContext);

    useEffect(() => {
        if (activeDialog !== Dialogs.QuestDialog) {
            resetForm();
        }
    }, [activeDialog !== Dialogs.QuestDialog]);

    const confirmAction = useCallback(() => {
        if (_.filter(errors, err => err != '').length > 0) {
            setFormDirty();
            return;
        }

        const originalQuestSchema = getValues() as unknown as QuestSchema;

        // That part can be deleted, when Quest dialog will support adding multiple rules for monster comparison
        const questSchema = {
            ...originalQuestSchema,
            stages: _.mapValues(originalQuestSchema.stages, stage => {
                return {
                    ...stage,
                    stageParts: _.mapValues(stage.stageParts, stagePart => {
                        if (stagePart.type === QuestType.KILLING) {
                            return {
                                ...stagePart,
                                rule: [{
                                    fieldName: "characterTemplateId",
                                    comparison: KillingQuestStagePartComparison.equality,
                                    value: (stagePart as any).monsterTemplateId
                                }]
                            } as KillingQuestStagePart;
                        }
                        return stagePart;
                    })
                }
            })
        };

        if (activeQuest?.id) {
            updateQuest(questSchema);
        } else {
            createQuest(questSchema);
        }
        setActiveDialog(null);
    }, [activeQuest, getValues, errors, values]);

    return <>
        <Button onClick={confirmAction} variant="contained">
            {activeQuest?.id ? 'Update' : 'Create'}
        </Button>
        <Button onClick={() => setActiveDialog(null)} variant="outlined">
            Cancel
        </Button>
    </>
}