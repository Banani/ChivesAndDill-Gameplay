import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid, GridActionsCellItem, GridColumns } from '@mui/x-data-grid';
import _ from 'lodash';
import { FunctionComponent, useCallback, useContext, useEffect, useMemo } from 'react';
import { FormTextField } from '../../components';
import { PackageContext } from '../../contexts';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { FormContext, FormContextProvider, FormFieldConditions, Schema, SchemaFieldType } from '../../contexts/FormContext';
import { SpriteGroupContext } from './SpriteGroupContext';

import styles from "./SpriteGroupDialog.module.scss";

export const SpriteGroupDialog = () => {
    const schema: Schema = useMemo(() => {
        return {
            name: {
                type: SchemaFieldType.Text,
                conditions: [{ type: FormFieldConditions.Required }],
                defaultValue: ""
            }
        }
    }, [])

    return <FormContextProvider schema={schema}><SpriteGroupDialogContent /></FormContextProvider>
}

const SpriteGroupDialogContent: FunctionComponent = ({ }) => {
    const { activeDialog, setActiveDialog } = useContext(DialogContext);
    const { errors, setFormDirty, resetForm, getFieldValue } = useContext(FormContext);
    const { createSpriteGroup, deleteSpriteGroup } = useContext(SpriteGroupContext);
    const packageContext = useContext(PackageContext);
    const spriteGroups = packageContext?.backendStore?.spriteGroups?.data ?? {};

    useEffect(() => {
        if (activeDialog !== Dialogs.SpriteGroupsDialog) {
            resetForm();
        }
    }, [activeDialog === Dialogs.SpriteGroupsDialog]);

    const confirmCreation = useCallback(() => {
        if (_.filter(errors, err => err != '').length > 0) {
            setFormDirty();
            return;
        }

        createSpriteGroup({ name: getFieldValue('name') })
        resetForm();
    }, [createSpriteGroup, errors, setFormDirty, getFieldValue]);

    const spriteGroupColumns: GridColumns = [
        { field: 'name', headerName: 'Item Name', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 80,
            getActions: ({ id }: any) => {
                return [
                    <GridActionsCellItem
                        label="Delete"
                        icon={<DeleteIcon />}
                        onClick={() =>
                            deleteSpriteGroup(id)
                        }
                    />,
                ];
            },
        }
    ];

    return (
        <Dialog open={activeDialog === Dialogs.SpriteGroupsDialog} onClose={() => setActiveDialog(null)} maxWidth="xl">

            <DialogTitle>Sprite Groups</DialogTitle>
            <DialogContent className={styles['dialog']}>

                <div className={styles['adding-row']}>
                    <FormTextField propName={`name`} label="Name" />
                    <Button className={styles['add-button']} variant="outlined" onClick={() => confirmCreation()}><AddIcon /></Button>
                </div>

                <div className={styles['grid-holder']}>
                    <DataGrid
                        rows={_.map(spriteGroups, (item) => item)}
                        columns={spriteGroupColumns}
                        density="compact"
                        autoPageSize
                    />
                </div>

            </DialogContent>

        </Dialog>
    );
};
