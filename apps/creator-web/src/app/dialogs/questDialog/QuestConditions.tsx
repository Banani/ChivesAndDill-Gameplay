import { QuestSchema } from "@bananos/types";
import { GridSelectionModel } from "@mui/x-data-grid";
import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { Label } from "../../components";
import { AssignmentPanel } from "../../components/assignmentPanel";
import { PackageContext } from "../../contexts";
import { DialogContext, Dialogs } from "../../contexts/dialogContext";
import { FormContext } from "../../contexts/FormContext";
import { QuestsContext } from "../../views/quests/QuestsContextProvider";


export const QuestConditions = () => {
    const { activeQuest, setActiveQuest } = useContext(QuestsContext);
    const { activeDialog } = useContext(DialogContext);
    const { changeValue, getFieldValue, errors } = useContext(FormContext);
    const packageContext = useContext(PackageContext);
    const questSchemas = packageContext?.backendStore?.questSchemas?.data ?? {};
    const [requiredQuests, setRequiredQuests] = useState<Record<string, string>>({});
    const [initSelectionModel, setInitSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        if (activeDialog === Dialogs.QuestDialog && activeQuest !== null) {
            setInitSelectionModel(_.map(activeQuest.requiredQuests, (_, questId) => questId))
            const requiredQuests = getFieldValue('requiredQuests');
            setRequiredQuests(requiredQuests);
            setInitSelectionModel(Object.keys(requiredQuests))
        }
    }, [activeDialog === Dialogs.QuestDialog])

    useEffect(() => {
        if (activeQuest) {
            changeValue('requiredQuests', requiredQuests);
        }
    }, [requiredQuests]);

    const columns = [
        {
            field: 'name',
            headerName: 'Quest Name',
            flex: 1
        },
    ]

    return (<>
        <Label>Required quests completed:</Label>
        <AssignmentPanel
            allItems={_.pickBy(questSchemas, (questSchema: QuestSchema) => questSchema.id !== activeQuest?.id)}
            allItemsColumnDefinition={columns}
            selectedItems={requiredQuests}
            selectedItemsColumnDefinition={columns}
            updateSelectedItems={setRequiredQuests}
            initSelectionModel={initSelectionModel}
            errors={errors}
            errorPath={"requiredQuests."}
        /></>)
}