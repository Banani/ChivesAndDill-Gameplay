import { CharacterClass } from '@bananos/types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext, useEffect, useMemo, useState } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';

import { Box, Tab, Tabs } from '@mui/material';
import { FormBuilder } from '../../components/formBuilder';
import { FormContextProvider, FormFieldConditions, Schema, SchemaFieldType } from '../../contexts/FormContext';
import { CharacterClassesContext } from '../../views/characterClasses/CharacterClassesContextProvider';
import styles from "./CharacterClasses.module.scss";
import { CharacterClassActions } from './CharacterClassesActions';
import { CharacterClassSpells } from './CharacterClassesSpells';

enum CharacterClassesDialogTabs {
    Default = 'Default',
    Spells = 'Spells',
}

const DefaultCharacterClass: CharacterClass = {
    id: "",
    name: "",
    iconImage: "https://static.wikia.nocookie.net/wowwiki/images/0/0c/Ability_dualwieldspecialization.png",
    spells: {}
} as CharacterClass

export const CharacterClassesDialog = () => {
    const { activeCharacterClass, setActiveCharacterClass } = useContext(CharacterClassesContext);
    let defaultCharacterClass = activeCharacterClass?.id ? activeCharacterClass : DefaultCharacterClass;

    const [activeTab, setActiveTab] = useState<CharacterClassesDialogTabs>(CharacterClassesDialogTabs.Default);
    const changeActiveTab = (event: React.SyntheticEvent, newValue: CharacterClassesDialogTabs) => {
        setActiveTab(newValue);
    };

    const defaultPartSchema: Schema = useMemo(() => {
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


    const spellsSchema: Schema = useMemo(() => {
        return {
            spells: {
                type: SchemaFieldType.Record,
                hidden: true,
                defaultValue: defaultCharacterClass.spells ?? {},
                schema: {
                    spellId: {
                        type: SchemaFieldType.Text,
                        hidden: true
                    },
                    minLevel: {
                        type: SchemaFieldType.Number,
                        conditions: [
                            { type: FormFieldConditions.Required },
                            { type: FormFieldConditions.PositiveNumber },
                            { type: FormFieldConditions.Number }
                        ],
                    },
                }
            }
        }
    }, [defaultCharacterClass]);

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

    const wholeSchema = useMemo(() => ({ ...defaultPartSchema, ...spellsSchema }), [defaultPartSchema, spellsSchema]);

    if (!activeCharacterClass) {
        return null;
    }

    return (
        <Dialog open={activeDialog === Dialogs.CharacterClassDialog} onClose={() => setActiveDialog(null)} maxWidth="xl" className={styles['dialog']}>
            <FormContextProvider schema={wholeSchema}>
                <DialogTitle>{activeCharacterClass?.id ? 'Update' : 'Create'} Class</DialogTitle>
                <DialogContent className={styles['dialog-content']}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={activeTab} onChange={changeActiveTab} aria-label="basic tabs example">
                            <Tab label="Details" aria-controls={CharacterClassesDialogTabs.Default} value={CharacterClassesDialogTabs.Default} />
                            <Tab label="Spells" aria-controls={CharacterClassesDialogTabs.Spells} value={CharacterClassesDialogTabs.Spells} />
                        </Tabs>
                    </Box>
                    <div role="tabpanel" hidden={activeTab !== CharacterClassesDialogTabs.Default} aria-labelledby={CharacterClassesDialogTabs.Default}>
                        {activeTab === CharacterClassesDialogTabs.Default ? <>
                            <FormBuilder schema={defaultPartSchema} />
                        </> : null}
                    </div>
                    <div role="tabpanel" hidden={activeTab !== CharacterClassesDialogTabs.Spells} aria-labelledby={CharacterClassesDialogTabs.Spells}>
                        {activeTab === CharacterClassesDialogTabs.Spells ? <>
                            <CharacterClassSpells />
                        </> : null}
                    </div>
                </DialogContent>
                <DialogActions>
                    <CharacterClassActions />
                </DialogActions>
            </FormContextProvider>
        </Dialog >
    );
};
