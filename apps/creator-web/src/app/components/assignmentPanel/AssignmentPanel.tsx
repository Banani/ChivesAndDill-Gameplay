import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem, GridCellParams, GridColumns, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';

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
    initSelectionModel?: GridSelectionModel;
    errorPath?: string;
    errors?: Record<string, string>;
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
    idField,
    initSelectionModel,
    errorPath,
    errors
}) => {
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

    const clearSelectedItems = useCallback((selectionModel) => {
        updateSelectedItems((prev: GridSelectionModel) => {
            const currentItemsReward = _.cloneDeep(prev ?? {});

            _.forEach(currentItemsReward, (_, key) => {
                if (selectionModel.indexOf(key) === -1) {
                    delete currentItemsReward[key];
                }
            })

            selectionModel.forEach((selectedId: any) => {
                if (!currentItemsReward[selectedId]) {
                    currentItemsReward[selectedId] = getInitialRow ? getInitialRow(selectedId as string) : allItems[selectedId];
                }
            })

            return currentItemsReward;
        })
    }, []);

    useEffect(() => {
        if (initSelectionModel) {
            setSelectionModel(initSelectionModel)
        }
    }, [initSelectionModel]);

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
                            onClick={() => {
                                const newSelectionModel = selectionModel.filter((itemId) => itemId !== id);
                                setSelectionModel(newSelectionModel)
                                clearSelectedItems(newSelectionModel);
                            }}
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
                        clearSelectedItems(newSelectionModel)
                    }}
                    selectionModel={selectionModel}
                    rows={_.map(allItems, (item) => item)}
                    columns={allItemsColumnDefinition}
                    checkboxSelection
                    density="compact"
                    autoPageSize
                />
            </div>
            <div className={styles['table-wrapper']}>
                <DataGrid
                    experimentalFeatures={{ newEditingApi: true }}
                    disableSelectionOnClick
                    rows={_.map(selectedItems, item => mapItemForPreview ? mapItemForPreview(item) : item)}
                    columns={selectedColumns.map(col => {
                        if (col.editable) {
                            col.cellClassName = (params: GridCellParams<any>) => {
                                if (params.value == null) {
                                    return '';
                                }

                                const errorProp = (errorPath ?? "") + params.id + "." + params.field;
                                return errors?.[errorProp] !== "" ? styles['error-cell'] : "";
                            }

                            col.renderCell = (params: GridRenderCellParams<any>) => {
                                const errorProp = (errorPath ?? "") + params.id + "." + params.field;
                                return <div title={errors?.[errorProp]}>{params.row[params.field]}</div>;
                            }
                        }
                        return col;
                    })}
                    density="compact"
                    autoPageSize
                    processRowUpdate={(newRow) => {
                        const parsedNewRow: Record<string, any> = _.mapValues(newRow, (field: any) => field === null ? "" : field)
                        updateSelectedItems(_.mapValues(selectedItems, (item => {
                            if (item[idField ?? ""] === parsedNewRow["id"]) {
                                return mapItemForSave ? mapItemForSave(item, parsedNewRow) : item;
                            }
                            return item;
                        })));
                        return parsedNewRow;
                    }}
                />
            </div>
        </div>
    );
} 