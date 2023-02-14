import { QuestSchema } from "@bananos/types";
import { TextField } from "@mui/material";
import { GridSelectionModel } from "@mui/x-data-grid";
import _ from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { Label } from "../../components";
import { AssignmentPanel } from "../../components/assignmentPanel";
import { PackageContext } from "../../contexts";
import { DialogContext, Dialogs } from "../../contexts/dialogContext";
import { QuestsContext } from "../../views/quests/QuestsContextProvider";


export const QuestConditions = () => {
    const packageContext = useContext(PackageContext);
    const { activeQuest, setActiveQuest } = useContext(QuestsContext);
    const [requiredQuests, setRequiredQuests] = useState<Record<string, string>>({});
    const questSchemas = packageContext?.backendStore?.questSchemas?.data ?? {};
    const { activeDialog } = useContext(DialogContext);
    const [initSelectionModel, setInitSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        if (activeDialog === Dialogs.QuestDialog && activeQuest !== null) {
            setInitSelectionModel(_.map(activeQuest.requiredQuests, (_, questId) => questId))
        }
    }, [activeDialog === Dialogs.QuestDialog])

    useEffect(() => {
        if (activeQuest) {
            setActiveQuest((prev: any) => ({ ...prev, requiredQuests }))
        }
    }, [requiredQuests]);

    const columns = [
        {
            field: 'name',
            headerName: 'Quest Name',
            flex: 1
        },
    ]

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

    return (<>
        <TextField
            value={activeQuest?.requiredLevel}
            onChange={(e) => changeValue('requiredLevel', parseInt(e.target.value))}
            margin="dense"
            label="Required level"
            type="number"
            fullWidth
            variant="standard"
        />
        <Label>Required quests completed:</Label>
        <AssignmentPanel
            allItems={_.pickBy(questSchemas, (questSchema: QuestSchema) => questSchema.id !== activeQuest?.id)}
            allItemsColumnDefinition={columns}
            selectedItems={requiredQuests}
            selectedItemsColumnDefinition={columns}
            updateSelectedItems={setRequiredQuests}
            initSelectionModel={initSelectionModel}
        /></>)
}