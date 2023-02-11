import { ItemTemplate } from '@bananos/types';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { AssignmentPanel } from '../../components/assignmentPanel';
import { ItemPreview } from '../../components/itemPreview';
import { PackageContext } from '../../contexts';
import { NpcContext, NpcTemplate } from '../../views';


export const ItemStock = () => {
    const packageContext = useContext(PackageContext);
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};
    const [localItemTemplates, setLocalItemTemplates] = useState<Record<string, ItemTemplate>>({});
    const { setActiveNpcTemplate } = useContext(NpcContext);

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
        setActiveNpcTemplate((prev: NpcTemplate) => ({
            ...prev,
            stock: _.mapValues(localItemTemplates, () => true),
        }));
    }, [localItemTemplates]);

    return (
        <AssignmentPanel
            allItems={itemTemplates}
            allItemsColumnDefinition={columns}
            selectedItems={localItemTemplates}
            selectedItemsColumnDefinition={columns}
            updateSelectedItems={setLocalItemTemplates}
        />
    );
};
