import { QuestSchema } from "@bananos/types";
import { Button } from "@mui/material";
import _ from "lodash";
import { useCallback, useContext, useEffect } from "react";
import { DialogContext, Dialogs } from "../../contexts/dialogContext";
import { FormContext } from "../../contexts/FormContext";
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

        if (activeQuest?.id) {
            updateQuest(getValues() as unknown as QuestSchema);
        } else {
            createQuest(getValues() as unknown as QuestSchema);
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