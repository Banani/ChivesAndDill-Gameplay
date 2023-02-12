import { TextField } from "@mui/material";
import _ from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { Label } from "../../components";
import { AssignmentPanel } from "../../components/assignmentPanel";
import { PackageContext } from "../../contexts";
import { QuestsContext } from "../../views/quests/QuestsContextProvider";


export const QuestConditions = () => {
    const packageContext = useContext(PackageContext);
    const { activeQuest, setActiveQuest } = useContext(QuestsContext);
    const [requiredQuests, setRequiredQuests] = useState<Record<string, string>>({});
    const questSchemas = packageContext?.backendStore?.questSchemas?.data ?? {};

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
            allItems={questSchemas}
            allItemsColumnDefinition={columns}
            selectedItems={requiredQuests}
            selectedItemsColumnDefinition={columns}
            updateSelectedItems={setRequiredQuests}
        /></>)
}