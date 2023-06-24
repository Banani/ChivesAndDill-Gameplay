import { Spell } from '@bananos/types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext, useEffect, useMemo } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';

import { FormBuilder } from '../../components/formBuilder';
import { FormContextProvider, FormFieldConditions, Schema, SchemaFieldType } from '../../contexts/FormContext';
import { SpellsContext } from '../../views/spells/SpellsContextProvider';
import { SpellActions } from './SpellActions';
import styles from "./SpellDialog.module.scss";

const DefaultSpell: Spell = {
    id: "",
    name: "",
    image: "https://static.wikia.nocookie.net/wowwiki/images/0/0c/Ability_dualwieldspecialization.png"
} as Spell

export const SpellDialog = () => {
    const { activeSpell, setActiveSpell } = useContext(SpellsContext);
    let defaultSpell = activeSpell?.id ? activeSpell : DefaultSpell;

    const schema: Schema = useMemo(() => {
        return {
            id: {
                type: SchemaFieldType.Text,
                defaultValue: defaultSpell.id,
                hidden: true
            },
            name: {
                label: "Name",
                type: SchemaFieldType.Text,
                conditions: [{ type: FormFieldConditions.Required }],
                defaultValue: defaultSpell.name
            },
            image: {
                label: "Image",
                type: SchemaFieldType.Text,
                defaultValue: defaultSpell.image
            }
        }
    }, [activeSpell]);

    const { activeDialog, setActiveDialog } = useContext(DialogContext);

    useEffect(() => {
        if (activeDialog === Dialogs.SpellDialog && activeSpell === null) {
            setActiveSpell(Object.assign({}, DefaultSpell) as Spell);
        }
    }, [activeDialog === Dialogs.SpellDialog, activeSpell]);

    useEffect(() => {
        if (activeDialog !== Dialogs.SpellDialog) {
            setActiveSpell(null);
        }
    }, [activeDialog !== Dialogs.SpellDialog]);

    if (!activeSpell) {
        return null;
    }

    return (
        <Dialog open={activeDialog === Dialogs.SpellDialog} onClose={() => setActiveDialog(null)} maxWidth="xl" className={styles['dialog']}>
            <FormContextProvider schema={schema}>
                <DialogTitle>{activeSpell?.id ? 'Update' : 'Create'} Spell</DialogTitle>
                <DialogContent className={styles['dialog-content']}>
                    <FormBuilder schema={schema} />
                </DialogContent>
                <DialogActions>
                    <SpellActions />
                </DialogActions>
            </FormContextProvider>
        </Dialog >
    );
};
