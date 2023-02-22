import { FunctionComponent } from "react";
import { FormTextField } from "../../../components";

export const NpcDefaultStep: FunctionComponent = () => {
    return <>
        <FormTextField propName="name" label="Name" />
        <FormTextField propName="healthPoints" label="Health Points" />
        <FormTextField propName="healthPointsRegeneration" label="Health Points Regeneration" />
        <FormTextField propName="spellPower" label="Spell Power" />
        <FormTextField propName="spellPowerRegeneration" label="Spell Power Regeneration" />
        <FormTextField propName="movementSpeed" label="Movement Speed" />
    </>
}