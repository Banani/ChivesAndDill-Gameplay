import { QuestRewardItem } from "@bananos/types";
import { TextField } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import _ from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { AssignmentPanel } from "../../components/assignmentPanel";
import { ItemPreview } from "../../components/itemPreview";
import { PackageContext } from "../../contexts";
import { QuestsContext } from "../../views/quests/QuestsContextProvider";

export const QuestRewards = () => {
    const packageContext = useContext(PackageContext);
    const { activeQuest, setActiveQuest } = useContext(QuestsContext);
    const [rewardItems, setRewardItems] = useState<Record<string, QuestRewardItem>>({});
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};

    useEffect(() => {
        if (activeQuest) {
            setActiveQuest((prev: any) => ({ ...prev, questReward: { ...prev.questReward, items: rewardItems } }))
        }
    }, [rewardItems]);

    const columns = [
        {
            field: 'image',
            headerName: 'Image',
            width: 54,
            renderCell: (params: GridRenderCellParams<QuestRewardItem>) =>
                <ItemPreview itemTemplate={itemTemplates[params.id]} />
            ,
        },
        {
            field: 'name',
            headerName: 'Item Name',
            flex: 1,
            renderCell: (params: GridRenderCellParams<QuestRewardItem>) => {
                return itemTemplates[params.id].name;
            },
        },
    ]

    const selectedColumns = [...columns,
    {
        field: 'amount',
        headerName: 'Amount',
        type: 'number',
        flex: 1,
        editable: true,
    }]

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
            value={activeQuest?.questReward.experience}
            onChange={(e) => changeValue('questReward.experience', parseInt(e.target.value))}
            margin="dense"
            label="Experience"
            type="number"
            fullWidth
            variant="standard"
        />
        <TextField
            value={activeQuest?.questReward.currency}
            onChange={(e) => changeValue('questReward.currency', parseInt(e.target.value))}
            margin="dense"
            label="Money (in coppers)"
            fullWidth
            variant="standard"
            type="number"
        />
        <AssignmentPanel
            allItems={itemTemplates}
            allItemsColumnDefinition={columns}
            selectedItems={rewardItems}
            selectedItemsColumnDefinition={selectedColumns}
            mapItemForPreview={(item: QuestRewardItem) => ({
                id: item.itemTemplateId,
                amount: item.amount,
                image: itemTemplates[item.itemTemplateId].image,
                name: itemTemplates[item.itemTemplateId].name,
            })}
            mapItemForSave={(item, newRow) => ({
                ...item,
                amount: newRow.amount
            })}
            idField={'itemTemplateId'}
            updateSelectedItems={setRewardItems}
            getInitialRow={(id) => ({ itemTemplateId: id, amount: 1 })}
        /></>)
}