import { QuestRewardItem } from "@bananos/types";
import { GridRenderCellParams, GridSelectionModel } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { AssignmentPanel } from "../../components/assignmentPanel";
import { ItemPreview } from "../../components/itemPreview";
import { PackageContext } from "../../contexts";
import { DialogContext, Dialogs } from "../../contexts/dialogContext";
import { FormContext } from "../../contexts/FormContext";

export const QuestRewards = () => {
    const { activeDialog } = useContext(DialogContext);
    const { changeValue, getFieldValue, errors, isFormReady } = useContext(FormContext);
    const packageContext = useContext(PackageContext);
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};
    const [initSelectionModel, setInitSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        if (activeDialog === Dialogs.QuestDialog && isFormReady) {
            const rewardItems = getFieldValue('questReward.items');
            setInitSelectionModel(Object.keys(rewardItems))
        }
    }, [activeDialog === Dialogs.QuestDialog, getFieldValue, isFormReady])

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


    if (!isFormReady) {
        return null;
    }
    const items = getFieldValue('questReward.items');

    return (<>
        <AssignmentPanel
            allItems={itemTemplates}
            allItemsColumnDefinition={columns}
            selectedItems={items}
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
            updateSelectedItems={(callback) => changeValue('questReward.items', callback(items))}
            getInitialRow={(id) => ({ itemTemplateId: id, amount: 1 })}
            initSelectionModel={initSelectionModel}
            errors={errors}
            errorPath="questReward.items."
        />
    </>)
}