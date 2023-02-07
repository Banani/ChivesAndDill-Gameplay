import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem, GridColumns, GridSelectionModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import styles from './AssignmentPanel.module.scss';


interface AssignmentPanelProps {
    allItems: Record<string, any>;
    allItemsColumnDefinition: GridColumns;
    selectedItemsColumnDefinition: GridColumns;
    selectionChanged: (selectionModel: GridSelectionModel) => void
}

export const AssignmentPanel: FunctionComponent<AssignmentPanelProps> = ({
    allItems,
    allItemsColumnDefinition,
    selectedItemsColumnDefinition,
    selectionChanged
}) => {
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => { selectionChanged(selectionModel) }, [selectionModel])

    const selectedColumns: GridColumns = useMemo(
        () => selectedItemsColumnDefinition.concat([
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
        ]),
        [selectionModel]
    );


    return (
        <div className={styles['panel-wrapper']}>
            <div className={styles['table-wrapper']}>
                <DataGrid
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    selectionModel={selectionModel}
                    rows={_.map(allItems, (item) => item)}
                    columns={allItemsColumnDefinition}
                    pageSize={15}
                    checkboxSelection
                    density="compact"
                />
            </div>
            <div className={styles['table-wrapper']}>
                <DataGrid
                    disableSelectionOnClick
                    rows={_.map(selectionModel, (id: string) => allItems[id])}
                    columns={selectedColumns}
                    pageSize={15}
                    density="compact"
                />
            </div>
        </div>
    );
} 