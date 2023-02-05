import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumns, GridSelectionModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { PackageContext } from '../../contexts';
import { NpcContext, NpcTemplate } from '../../views';

import styles from './ItemStock.module.scss';

const columns: GridColDef[] = [{ field: 'name', headerName: 'Item Name', flex: 1 }];

export const ItemStock = () => {
   const packageContext = useContext(PackageContext);
   const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ? packageContext?.backendStore?.itemTemplates?.data : {};
   const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
   const { setActiveNpcTemplate, activeNpcTemplate } = useContext(NpcContext);

   useEffect(() => {
      setActiveNpcTemplate((prev: NpcTemplate) => ({
         ...prev,
         stock: _.chain(selectionModel)
            .keyBy()
            .mapValues(() => true)
            .value(),
      }));
   }, [selectionModel]);

   const selectedColumns: GridColumns = useMemo(
      () => [
         { field: 'name', headerName: 'Item Name', flex: 1 },
         {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 80,
            getActions: ({ id }) => {
               return [
                  <GridActionsCellItem
                     label="Delete"
                     icon={<DeleteIcon />}
                     onClick={() => setSelectionModel(selectionModel.filter((itemId) => itemId !== id))}
                  />,
               ];
            },
         },
      ],
      [selectionModel]
   );

   return (
      <div className={styles['stock-wrapper']}>
         <div className={styles['table-wrapper']}>
            <DataGrid
               onSelectionModelChange={(newSelectionModel) => {
                  setSelectionModel(newSelectionModel);
               }}
               selectionModel={selectionModel}
               rows={_.map(itemTemplates, (item) => item)}
               columns={columns}
               pageSize={15}
               checkboxSelection
               density="compact"
            />
         </div>
         <div className={styles['table-wrapper']}>
            <DataGrid
               disableSelectionOnClick
               rows={_.map(selectionModel, (id) => itemTemplates[id])}
               columns={selectedColumns}
               pageSize={15}
               density="compact"
            />
         </div>
      </div>
   );
};
