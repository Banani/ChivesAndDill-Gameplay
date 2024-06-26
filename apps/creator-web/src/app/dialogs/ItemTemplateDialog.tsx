import { EquipmentItemTemplate, EquipmentSlot, ItemTemplate, ItemTemplateType } from '@bananos/types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import _ from 'lodash';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { FormTextField } from '../components';
import { FormSelectField } from '../components/formSelectField';
import { FormContext, FormContextProvider, FormFieldConditions, Schema, SchemaFieldType } from '../contexts/FormContext';
import { DialogContext, Dialogs } from '../contexts/dialogContext';
import { ItemsContext } from '../views/items/ItemsContextProvider';

const DefaultItem = {
    type: ItemTemplateType.Generic,
    id: '',
    name: '',
    description: "",
    image: '',
    stack: 1,
    value: 100,
    slot: EquipmentSlot.Back,
    armor: 0,
    stamina: 0,
    agility: 0,
    intelect: 0,
    strength: 0,
    spirit: 0,
    criticalStrike: 0,
    haste: 0,
    dodge: 0,
    block: 0
};

export const ItemTemplateDialog = () => {
    const { activeItemTemplate } = useContext(ItemsContext);

    const schema: Schema = useMemo(() => {
        const defaultValues = activeItemTemplate?.id ? _.merge(DefaultItem, activeItemTemplate) : DefaultItem;

        return {
            id: {
                type: SchemaFieldType.Text,
                defaultValue: defaultValues.id
            },
            name: {
                type: SchemaFieldType.Text,
                conditions: [{ type: FormFieldConditions.Required }],
                defaultValue: defaultValues.name
            },
            description: {
                type: SchemaFieldType.Text,
                defaultValue: defaultValues.description
            },
            stack: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.stack,
            },
            value: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: defaultValues.value,
            },
            image: {
                type: SchemaFieldType.Text,
                defaultValue: defaultValues.image,
            },
            type: {
                type: SchemaFieldType.Select,
                options: [
                    { label: ItemTemplateType.Equipment, value: ItemTemplateType.Equipment },
                    { label: ItemTemplateType.Generic, value: ItemTemplateType.Generic }
                ],
                defaultValue: defaultValues.type,
            },
            slot: {
                type: SchemaFieldType.Text,
                options: Object.values(EquipmentSlot).map(slot => ({ label: slot, value: slot })),
                defaultValue: (defaultValues as EquipmentItemTemplate).slot,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            },
            armor: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: (defaultValues as EquipmentItemTemplate).armor,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            },
            stamina: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: (defaultValues as EquipmentItemTemplate).stamina,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            },
            agility: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: (defaultValues as EquipmentItemTemplate).agility,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            },
            intelect: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: (defaultValues as EquipmentItemTemplate).intelect,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            },
            spirit: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: (defaultValues as EquipmentItemTemplate).spirit,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            },
            strength: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: (defaultValues as EquipmentItemTemplate).strength,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            },
            haste: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: (defaultValues as EquipmentItemTemplate).haste,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            },
            criticalStrike: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: (defaultValues as EquipmentItemTemplate).criticalStrike,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            },
            dodge: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: (defaultValues as EquipmentItemTemplate).dodge,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            },
            block: {
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }],
                defaultValue: (defaultValues as EquipmentItemTemplate).block,
                prerequisite: ({ type }) => type === ItemTemplateType.Equipment
            }
        }
    }, [activeItemTemplate, DefaultItem])

    return <FormContextProvider schema={schema}><ItemTemplateDialogContent /></FormContextProvider>
}

const ItemTemplateDialogContent = () => {
    const { activeDialog, setActiveDialog } = useContext(DialogContext);
    const { createItemTemplate, updateItemTemplate, activeItemTemplate } = useContext(ItemsContext);
    const { errors, setFormDirty, resetForm, getFieldValue, getValues } = useContext(FormContext);

    useEffect(() => {
        if (activeDialog !== Dialogs.ItemDialog) {
            resetForm();
        }
    }, [activeDialog !== Dialogs.ItemDialog]);

    const confirmAction = useCallback(() => {
        if (_.filter(errors, err => err != '').length > 0) {
            setFormDirty();
            return;
        }

        if (activeItemTemplate === null) {
            createItemTemplate(getValues() as unknown as ItemTemplate);
        } else {
            updateItemTemplate(getValues() as unknown as ItemTemplate);
        }
        setActiveDialog(null);
    }, [getValues, activeItemTemplate]);

    return (
        <Dialog open={activeDialog === Dialogs.ItemDialog} onClose={() => setActiveDialog(null)}>
            <DialogTitle>Create Item</DialogTitle>
            <DialogContent>
                <FormSelectField propName="type" label="Item type" />
                <FormTextField propName="name" label="Name" />
                <FormTextField propName="description" label="Description" multiline />
                <FormTextField propName="stack" label="Stack" />
                <FormTextField propName="value" label="Value in coppers" />
                <FormTextField propName="image" label="Image" />

                {getFieldValue("type") === ItemTemplateType.Equipment ? (
                    <>
                        <FormSelectField propName="slot" label="Slot" />
                        <FormTextField propName="armor" label="Armor" />
                        <FormTextField propName="stamina" label="Stamina" />
                        <FormTextField propName="agility" label="Agility" />
                        <FormTextField propName="intelect" label="Intelect" />
                        <FormTextField propName="strength" label="Strength" />
                        <FormTextField propName="spirit" label="Spirit" />
                        <FormTextField propName="haste" label="Haste" />
                        <FormTextField propName="criticalStrike" label="Critical strike" />
                        <FormTextField propName="dodge" label="Dodge" />
                        <FormTextField propName="block" label="Block" />
                    </>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={confirmAction} variant="contained">
                    {activeItemTemplate ? 'Update' : 'Create'}
                </Button>
                <Button onClick={() => setActiveDialog(null)} variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog >
    );
};
