import { CharacterClass } from "@bananos/types";
import { Button } from "@mui/material";
import _ from "lodash";
import { useCallback, useContext, useEffect } from "react";
import { FormContext } from "../../contexts/FormContext";
import { DialogContext, Dialogs } from "../../contexts/dialogContext";
import { CharacterClassesContext } from "../../views/characterClasses/CharacterClassesContextProvider";

export const CharacterClassActions = () => {
    const { setActiveDialog, activeDialog } = useContext(DialogContext);
    const { activeCharacterClass, createCharacterClass, updateCharacterClass } = useContext(CharacterClassesContext);
    const { getValues, values, errors, setFormDirty, resetForm } = useContext(FormContext);

    useEffect(() => {
        if (activeDialog !== Dialogs.CharacterClassDialog) {
            resetForm();
        }
    }, [activeDialog !== Dialogs.CharacterClassDialog]);

    const confirmAction = useCallback(() => {
        if (_.filter(errors, err => err != '').length > 0) {
            setFormDirty();
            return;
        }

        const characterClassSchema = getValues() as unknown as CharacterClass;

        if (activeCharacterClass?.id) {
            updateCharacterClass(characterClassSchema);
        } else {
            createCharacterClass(characterClassSchema);
        }
        setActiveDialog(null);
    }, [activeCharacterClass, getValues, errors, values]);

    return <>
        <Button onClick={confirmAction} variant="contained">
            {activeCharacterClass?.id ? 'Update' : 'Create'}
        </Button>
        <Button onClick={() => setActiveDialog(null)} variant="outlined">
            Cancel
        </Button>
    </>
}