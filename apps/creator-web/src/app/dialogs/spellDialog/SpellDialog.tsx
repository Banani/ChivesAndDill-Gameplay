import { AngleBlastSpell, DamageEffect, HealEffect, ProjectileSpell, ProjectileSubSpell, Spell, SpellEffectType, SpellType } from '@bananos/types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext, useEffect, useMemo } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';

import _ from 'lodash';
import { FormBuilder } from '../../components/formBuilder';
import { FormContextProvider, FormFieldConditions, Schema, SchemaFieldType } from '../../contexts/FormContext';
import { SpellsContext } from '../../views/spells/SpellsContextProvider';
import { SpellActions } from './SpellActions';
import styles from "./SpellDialog.module.scss";

const DefaultSpell: Spell = {
    type: SpellType.Projectile,
    id: "",
    name: "",
    description: "",
    image: "https://static.wikia.nocookie.net/wowwiki/images/0/0c/Ability_dualwieldspecialization.png",
    range: 250,
    spellPowerCost: 100,
    cooldown: 1000,
    spellEffectsOnTarget: {}
} as Spell

const DefaultProjectile: ProjectileSpell = {
    ...DefaultSpell,
    type: SpellType.Projectile,
    speed: 10,
}

const DefaultAngleBlast: AngleBlastSpell = {
    ...DefaultSpell,
    type: SpellType.AngleBlast,
    angle: 1
}

const DefaultDamageEffect: DamageEffect = {
    type: SpellEffectType.Damage,
    amount: 100,
    spellId: "",
}

const DefaultHealEffect: HealEffect = {
    type: SpellEffectType.Heal,
    amount: 100,
    spellId: "",
}

export const SpellDialog = () => {
    const { activeSpell, setActiveSpell } = useContext(SpellsContext);
    let defaultSpell = activeSpell?.id ? _.merge({}, DefaultSpell, activeSpell) : DefaultSpell;

    const schema: Schema = useMemo(() => {
        return {
            id: {
                type: SchemaFieldType.Text,
                defaultValue: defaultSpell.id,
                hidden: true
            },
            type: {
                label: "Spell type",
                type: SchemaFieldType.Select,
                options: [
                    { label: "Projectile", value: SpellType.Projectile },
                    { label: "Angle Blast", value: SpellType.AngleBlast }
                ],
                typeChanger: {
                    [SpellType.Projectile]: DefaultProjectile,
                    [SpellType.AngleBlast]: DefaultAngleBlast
                },
                defaultValue: defaultSpell.type
            },
            name: {
                label: "Name",
                type: SchemaFieldType.Text,
                conditions: [{ type: FormFieldConditions.Required }],
                defaultValue: defaultSpell.name
            },
            description: {
                label: "Description",
                type: SchemaFieldType.Text,
                defaultValue: defaultSpell.description
            },
            image: {
                label: "Image",
                type: SchemaFieldType.Text,
                conditions: [{ type: FormFieldConditions.Required }],
                defaultValue: defaultSpell.image
            },
            range: {
                label: "Range",
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber },],
                defaultValue: defaultSpell.range
            },
            spellPowerCost: {
                label: "Spell power cost",
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber },],
                defaultValue: defaultSpell.spellPowerCost
            },
            cooldown: {
                label: "Cooldown (miliseconds)",
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber },],
                defaultValue: defaultSpell.cooldown
            },
            speed: {
                label: "Speed",
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber },],
                defaultValue: (defaultSpell as ProjectileSubSpell).speed,
                prerequisite: ({ type }) => type === SpellType.Projectile
            },
            angle: {
                label: "Angle (radians 0-3.14*2)",
                type: SchemaFieldType.Number,
                conditions: [
                    { type: FormFieldConditions.Required },
                    { type: FormFieldConditions.Number },
                    { type: FormFieldConditions.Range, min: 0, max: 2 }
                ],
                prerequisite: ({ type }) => type === SpellType.AngleBlast
            },
            //requiredPowerStacks
            spellEffectsOnTarget: {
                label: "Spell effects on target",
                type: SchemaFieldType.Record,
                newElement: _.cloneDeep(DefaultDamageEffect),
                defaultValue: defaultSpell.spellEffectsOnTarget,
                schema: {
                    type: {
                        label: "Effect type",
                        type: SchemaFieldType.Select,
                        options: [
                            { label: "Damage", value: SpellEffectType.Damage },
                            { label: "Heal", value: SpellEffectType.Heal }
                        ],
                        typeChanger: {
                            [SpellEffectType.Damage]: DefaultDamageEffect,
                            [SpellEffectType.Heal]: DefaultHealEffect,
                        }
                    },
                    amount: {
                        label: "Amount",
                        type: SchemaFieldType.Number,
                        conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber },],
                        prerequisite: ({ type }) => type === SpellEffectType.Damage || type === SpellEffectType.Heal
                    },
                    spellId: {
                        type: SchemaFieldType.Text,
                        hidden: true
                    },
                }
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
