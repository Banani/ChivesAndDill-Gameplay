import { ItemTemplate } from '@bananos/types';
import { GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { AssignmentPanel } from '../../../components/assignmentPanel';
import { ItemPreview } from '../../../components/itemPreview';
import { PackageContext } from '../../../contexts';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';
import { FormContext } from '../../../contexts/FormContext';


export const MonsterLoot = () => {
    const packageContext = useContext(PackageContext);
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};
    const [localItemTemplates, setLocalItemTemplates] = useState<Record<string, ItemTemplate>>({});
    const { activeDialog } = useContext(DialogContext);
    const [initSelectionModel, setInitSelectionModel] = useState<GridSelectionModel>([]);
    const { changeValue, getFieldValue } = useContext(FormContext);

    useEffect(() => {
        if (activeDialog === Dialogs.NpcTemplateDialogs) {
            setInitSelectionModel(_.map(getFieldValue('stock'), (_, stockItemId) => stockItemId))
        }
    }, [activeDialog === Dialogs.NpcTemplateDialogs])

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
        changeValue('dropSchema.items', _.mapValues(localItemTemplates, () => true))
    }, [localItemTemplates]);

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
