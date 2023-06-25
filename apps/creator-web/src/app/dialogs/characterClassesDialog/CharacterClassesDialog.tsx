import { CharacterClass } from '@bananos/types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext, useEffect, useMemo } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';

import { FormBuilder } from '../../components/formBuilder';
import { FormContextProvider, FormFieldConditions, Schema, SchemaFieldType } from '../../contexts/FormContext';
import { CharacterClassesContext } from '../../views/characterClasses/CharacterClassesContextProvider';
import styles from "./CharacterClasses.module.scss";
import { CharacterClassActions } from './CharacterClassesActions';

const DefaultCharacterClass: CharacterClass = {
    id: "",
    name: "",
    iconImage: "https://static.wikia.nocookie.net/wowwiki/images/0/0c/Ability_dualwieldspecialization.png"
} as CharacterClass

export const CharacterClassesDialog = () => {
    const { activeCharacterClass, setActiveCharacterClass } = useContext(CharacterClassesContext);
    let defaultCharacterClass = activeCharacterClass?.id ? activeCharacterClass : DefaultCharacterClass;

    const schema: Schema = useMemo(() => {
        return {
            id: {
                type: SchemaFieldType.Text,
                defaultValue: defaultCharacterClass.id,
                hidden: true
            },
            name: {
                label: "Name",
                type: SchemaFieldType.Text,
                conditions: [{ type: FormFieldConditions.Required }],
                defaultValue: defaultCharacterClass.name
            },
            iconImage: {
                label: "Icon Image",
                type: SchemaFieldType.Text,
                defaultValue: defaultCharacterClass.iconImage
            }
        }
    }, [activeCharacterClass]);

    const { activeDialog, setActiveDialog } = useContext(DialogContext);

    useEffect(() => {
        if (activeDialog === Dialogs.CharacterClassDialog && activeCharacterClass === null) {
            setActiveCharacterClass(Object.assign({}, DefaultCharacterClass) as CharacterClass);
        }
    }, [activeDialog === Dialogs.CharacterClassDialog, activeCharacterClass]);

    useEffect(() => {
        if (activeDialog !== Dialogs.CharacterClassDialog) {
            setActiveCharacterClass(null);
        }
    }, [activeDialog !== Dialogs.CharacterClassDialog]);

    if (!activeCharacterClass) {
        return null;
    }

    return (
        <Dialog open={activeDialog === Dialogs.CharacterClassDialog} onClose={() => setActiveDialog(null)} maxWidth="xl" className={styles['dialog']}>
            <FormContextProvider schema={schema}>
                <DialogTitle>{activeCharacterClass?.id ? 'Update' : 'Create'} Class</DialogTitle>
                <DialogContent className={styles['dialog-content']}>
                    <FormBuilder schema={schema} />
                </DialogContent>
                <DialogActions>
                    <CharacterClassActions />
                </DialogActions>
            </FormContextProvider>
        </Dialog >
    );
};
