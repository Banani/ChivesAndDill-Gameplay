import { ItemTemplate } from '@bananos/types';
import { GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { AssignmentPanel } from '../../../components/assignmentPanel';
import { ItemPreview } from '../../../components/itemPreview';
import { PackageContext } from '../../../contexts';
import { FormContext } from '../../../contexts/FormContext';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';


export const ItemStock = () => {
    const packageContext = useContext(PackageContext);
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};
    const [localItemTemplates, setLocalItemTemplates] = useState<Record<string, ItemTemplate>>({});
    const { activeDialog } = useContext(DialogContext);
    const [initSelectionModel, setInitSelectionModel] = useState<GridSelectionModel>([]);
    const { changeValue, getFieldValue } = useContext(FormContext);

    useEffect(() => {
        if (activeDialog === Dialogs.NpcTemplateDialogs) {
            const stock = getFieldValue('stock')
            setInitSelectionModel(_.map(stock, (_, stockItemId) => stockItemId))
            setLocalItemTemplates(_.mapValues(stock, (_, stockItemId) => itemTemplates[stockItemId]))
        }
    }, [activeDialog === Dialogs.NpcTemplateDialogs, itemTemplates])

    const columns: GridColDef[] = [
        {
            field: 'image',
            headerName: 'Image',
            width: 54,
            renderCell: (params: GridRenderCellParams<ItemTemplate>) => {
                return <ItemPreview itemTemplate={itemTemplates[params.row.id]} />
            },
        }, { field: 'name', headerName: 'Item Name', flex: 1 }];

    useEffect(() => {
        changeValue('stock', _.mapValues(localItemTemplates, () => true))
    }, [localItemTemplates]);

    console.log(localItemTemplates)

    return (
        <AssignmentPanel
            allItems={itemTemplates}
            allItemsColumnDefinition={columns}
            selectedItems={localItemTemplates}
            selectedItemsColumnDefinition={columns}
            initSelectionModel={initSelectionModel}
            updateSelectedItems={setLocalItemTemplates}
        />
    );
};
