import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem, GridColumns, GridSelectionModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import styles from './AssignmentPanel.module.scss';


interface AssignmentPanelProps {
    allItems: Record<string, any>;
    selectedItems?: Record<string, any>;
    allItemsColumnDefinition: GridColumns;
    selectedItemsColumnDefinition: GridColumns;
    mapItemForPreview?: (item: any) => any;
    mapItemForSave?: (item: any, newRow: any) => any;
    updateSelectedItems: React.Dispatch<React.SetStateAction<any>>;
    getInitialRow?: (selectedId: string) => any;
    idField?: string;
}

export const AssignmentPanel: FunctionComponent<AssignmentPanelProps> = ({
    allItems,
    allItemsColumnDefinition,
    selectedItems,
    selectedItemsColumnDefinition,
    mapItemForPreview,
    mapItemForSave,
    getInitialRow,
    updateSelectedItems,
    idField
}) => {
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        const currentItemsReward = _.cloneDeep(selectedItems ?? {});

        _.forEach(currentItemsReward, (_, key) => {
            if (selectionModel.indexOf(key) === -1) {
                delete currentItemsReward[key];
            }
        })

        selectionModel.forEach(selectedId => {
            if (!currentItemsReward[selectedId]) {
                currentItemsReward[selectedId] = getInitialRow ? getInitialRow(selectedId as string) : allItems[selectedId];
            }
        })

        updateSelectedItems(currentItemsReward)

    }, [selectionModel])

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
                    experimentalFeatures={{ newEditingApi: true }}
                    disableSelectionOnClick
                    rows={_.map(selectedItems, item => mapItemForPreview ? mapItemForPreview(item) : item)}
                    columns={selectedColumns}
                    pageSize={15}
                    density="compact"
                    processRowUpdate={(newRow) => {
                        updateSelectedItems(_.mapValues(selectedItems, (item => {
                            if (item[idField ?? ""] === newRow.id) {
                                mapItemForSave ? mapItemForSave(item, newRow) : item;
                            }
                            return item;
                        })));
                        return newRow;
                    }}
                />
            </div>
        </div>
    );
} 