import { GridColDef } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext } from 'react';
import { AssignmentPanel } from '../../components/assignmentPanel';
import { PackageContext } from '../../contexts';
import { NpcContext, NpcTemplate } from '../../views';


const columns: GridColDef[] = [{ field: 'name', headerName: 'Item Name', flex: 1 }];

export const ItemStock = () => {
    const packageContext = useContext(PackageContext);
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ? packageContext?.backendStore?.itemTemplates?.data : {};
    const { setActiveNpcTemplate } = useContext(NpcContext);

    return (
        <AssignmentPanel
            allItems={itemTemplates}
            allItemsColumnDefinition={columns}
            selectedItemsColumnDefinition={columns}
            selectionChanged={(selectionModel) => {
                setActiveNpcTemplate((prev: NpcTemplate) => ({
                    ...prev,
                    stock: _.chain(selectionModel)
                        .keyBy()
                        .mapValues(() => true)
                        .value(),
                }));
            }} />
    );
};
