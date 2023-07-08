import { Spell } from "@bananos/types";
import { Button } from "@mui/material";
import _ from "lodash";
import { useCallback, useContext, useEffect } from "react";
import { FormContext } from "../../contexts/FormContext";
import { DialogContext, Dialogs } from "../../contexts/dialogContext";
import { SpellsContext } from "../../views/spells/SpellsContextProvider";

// TODO: TO mozna wydzielic 
export const SpellActions = () => {
    const { setActiveDialog, activeDialog } = useContext(DialogContext);
    const { activeSpell, createSpell, updateSpell } = useContext(SpellsContext);
    const { getValues, values, errors, setFormDirty, resetForm } = useContext(FormContext);

    useEffect(() => {
        if (activeDialog !== Dialogs.SpellDialog) {
            resetForm();
        }
    }, [activeDialog !== Dialogs.SpellDialog]);

    const confirmAction = useCallback(() => {
        if (_.filter(errors, err => err != '').length > 0) {
            setFormDirty();
            return;
        }

        const spellSchema = getValues() as unknown as Spell;

        if (activeSpell?.id) {
            updateSpell(spellSchema);
        } else {
            createSpell(spellSchema);
        }
        setActiveDialog(null);
    }, [activeSpell, getValues, errors, values]);

    return <>
        <Button onClick={confirmAction} variant="contained">
            {activeSpell?.id ? 'Update' : 'Create'}
        </Button>
        <Button onClick={() => setActiveDialog(null)} variant="outlined">
            Cancel
        </Button>
    </>
}