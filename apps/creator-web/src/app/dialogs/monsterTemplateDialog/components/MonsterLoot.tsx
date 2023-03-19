import { ItemTemplate } from '@bananos/types';
import { GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import { useContext, useEffect, useState } from 'react';
import { AssignmentPanel } from '../../../components/assignmentPanel';
import { ItemPreview } from '../../../components/itemPreview';
import { PackageContext } from '../../../contexts';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';
import { FormContext } from '../../../contexts/FormContext';


export const MonsterLoot = () => {
    const { activeDialog } = useContext(DialogContext);
    const { changeValue, getFieldValue, errors } = useContext(FormContext);
    const packageContext = useContext(PackageContext);
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};
    const [localItemTemplates, setLocalItemTemplates] = useState<Record<string, ItemTemplate>>({});
    const [initSelectionModel, setInitSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        if (activeDialog === Dialogs.MonsterTemplateDialog) {
            const itemTemplates = getFieldValue('dropSchema.items');
            setLocalItemTemplates(itemTemplates);
            setInitSelectionModel(Object.keys(itemTemplates))
        }
    }, [activeDialog === Dialogs.MonsterTemplateDialog])

    useEffect(() => {
        changeValue('dropSchema.items', localItemTemplates)
    }, [localItemTemplates]);


    const columns: GridColDef[] = [
        {
            field: 'image',
            headerName: 'Image',
            width: 54,
            renderCell: (params: GridRenderCellParams<ItemTemplate>) => {
                return <ItemPreview itemTemplate={itemTemplates[params.row.id]} />
            },
        }, { field: 'name', headerName: 'Item Name', flex: 1 }];


    const selectedColumns: GridColDef[] = [
        {
            field: 'image',
            headerName: 'Image',
            width: 54,
            renderCell: (params: GridRenderCellParams<ItemTemplate>) => {
                return <ItemPreview itemTemplate={itemTemplates[params.row.id]} />
            },
        },
        { field: 'name', headerName: 'Item Name', flex: 1 },
        { field: 'dropChance', headerName: 'Drop chance', flex: 1, editable: true },
        { field: 'maxAmount', headerName: 'Max amount', flex: 1, editable: true },
        { field: 'minAmount', headerName: 'Min amount', flex: 1, editable: true }
    ];

    return (
        <AssignmentPanel
            allItems={itemTemplates}
            allItemsColumnDefinition={columns}
            selectedItems={localItemTemplates}
            selectedItemsColumnDefinition={selectedColumns}
            initSelectionModel={initSelectionModel}
            updateSelectedItems={setLocalItemTemplates}
            getInitialRow={(selectedId) => ({ itemTemplateId: selectedId, dropChance: 50, minAmount: 1, maxAmount: 1 })}
            idField={'itemTemplateId'}
            mapItemForPreview={(item: any) => ({
                id: item.itemTemplateId,
                image: itemTemplates[item.itemTemplateId].image,
                name: itemTemplates[item.itemTemplateId].name,
                dropChance: item.dropChance,
                minAmount: item.minAmount,
                maxAmount: item.maxAmount,
            })}
            mapItemForSave={(item, newRow) => ({
                ...item,
                dropChance: newRow.dropChance,
                minAmount: newRow.minAmount,
                maxAmount: newRow.maxAmount
            })}
            errors={errors}
            errorPath="dropSchema.items."
        />
    );
};