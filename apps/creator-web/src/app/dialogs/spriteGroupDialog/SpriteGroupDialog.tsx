import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import _ from 'lodash';
import { FunctionComponent, useCallback, useContext, useEffect, useMemo } from 'react';
import { FormTextField } from '../../components';
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
    const { createSpriteGroup } = useContext(SpriteGroupContext);

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

    return (
        <Dialog open={activeDialog === Dialogs.SpriteGroupsDialog} onClose={() => setActiveDialog(null)}>
            <DialogTitle>Sprite Groups</DialogTitle>
            <DialogContent>
                <div className={styles['adding-row']}>
                    <FormTextField propName={`name`} label="Name" />
                    <Button className={styles['add-button']} variant="outlined" onClick={() => confirmCreation()}><AddIcon />asd</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
