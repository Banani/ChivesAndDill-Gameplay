import { FunctionComponent } from "react";
import { FormTextField } from "../../../components";

export const MonsterDefaultStep: FunctionComponent = () => {
    return <>
        <FormTextField propName="name" label="Name" />
        <FormTextField propName="healthPoints" label="Health Points" />
        <FormTextField propName="healthPointsRegeneration" label="Health Points Regeneration" />
        <FormTextField propName="spellPower" label="Spell Power" />
        <FormTextField propName="spellPowerRegeneration" label="Spell Power Regeneration" />
        <FormTextField propName="sightRange" label="Sight Range" />
        <FormTextField propName="desiredRange" label="Desired Range" />
        <FormTextField propName="escapeRange" label="Escape Range" />
        <FormTextField propName="attackFrequency" label="Attack Frequency (time in milliseconds that must elapse between attacks)" />
        <FormTextField propName="movementSpeed" label="Movement Speed" />
    </>
}