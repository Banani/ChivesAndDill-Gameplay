import { QuestSchema } from "@bananos/types";
import { GridSelectionModel } from "@mui/x-data-grid";
import _, { map } from "lodash";
import { useContext, useEffect, useState } from "react";
import { Label } from "../../components";
import { AssignmentPanel } from "../../components/assignmentPanel";
import { PackageContext } from "../../contexts";
import { DialogContext, Dialogs } from "../../contexts/dialogContext";
import { FormContext } from "../../contexts/FormContext";
import { QuestsContext } from "../../views/quests/QuestsContextProvider";


export const QuestConditions = () => {
    const { activeQuest } = useContext(QuestsContext);
    const { activeDialog } = useContext(DialogContext);
    const { changeValue, getFieldValue, errors, isFormReady } = useContext(FormContext);
    const packageContext = useContext(PackageContext);
    const questSchemas = packageContext?.backendStore?.questSchemas?.data ?? {};
    const [initSelectionModel, setInitSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        if (activeDialog === Dialogs.QuestDialog && isFormReady) {
            const requiredQuests = getFieldValue('requiredQuests');
            setInitSelectionModel(Object.keys(requiredQuests))
        }
    }, [activeDialog === Dialogs.QuestDialog, getFieldValue, isFormReady])

    const columns = [
        {
            field: 'name',
            headerName: 'Quest Name',
            flex: 1
        },
    ]

    if (!isFormReady) {
        return null;
    }

    const items: Record<string, boolean> = getFieldValue('requiredQuests');

    return (<>
        <Label>Required quests completed:</Label>
        <AssignmentPanel
            allItems={_.pickBy(questSchemas, (questSchema: QuestSchema) => questSchema.id !== activeQuest?.id)}
            allItemsColumnDefinition={columns}
            selectedItems={map(items, (_, key) => questSchemas[key])}
            selectedItemsColumnDefinition={columns}
            updateSelectedItems={(callback) => changeValue('requiredQuests', _.mapValues(callback(items), () => ""))}
            initSelectionModel={initSelectionModel}
            errors={errors}
            errorPath={"requiredQuests."}
        /></>)
}