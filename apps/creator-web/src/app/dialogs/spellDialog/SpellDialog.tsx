import { AbsorbShieldEffect, AngleBlastSpell, AreaEffect, AreaType, Attribute, DamageEffect, DirectInstantSpell, GenerateSpellPowerEffect, GuidedProjectileSpell, HealEffect, ProjectileSpell, ProjectileSubSpell, Spell, SpellEffectType, SpellType, TeleportationSpell, TickOverTimeEffect, TimeEffectType } from '@bananos/types';
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
    passThrough: false,
    cooldown: 1000,
    spellEffectsOnTarget: {},
    spellEffectsOnCasterOnSpellHit: {},
    casterImpact: true,
    monstersImpact: true,
    playersImpact: true,
} as Spell

const DefaultDirectInstant: DirectInstantSpell = {
    ...DefaultSpell,
    type: SpellType.DirectInstant
}

const DefaultProjectile: ProjectileSpell = {
    ...DefaultSpell,
    type: SpellType.Projectile,
    passThrough: false,
    speed: 10,
}

const DefaultGuidedProjectile: GuidedProjectileSpell = {
    ...DefaultSpell,
    type: SpellType.GuidedProjectile,
    speed: 10,
}

const DefaultAngleBlast: AngleBlastSpell = {
    ...DefaultSpell,
    type: SpellType.AngleBlast,
    angle: 1
}

const DefaultTeleportation: TeleportationSpell = {
    ...DefaultSpell,
    type: SpellType.Teleportation
}

const DefaultDamageEffect: DamageEffect = {
    type: SpellEffectType.Damage,
    amount: 100,
    attribute: Attribute.Strength,
    spellId: "",
    id: ""
}

const DefaultHealEffect: HealEffect = {
    type: SpellEffectType.Heal,
    amount: 100,
    spellId: "",
    id: ""
}

const DefaultGenerateSpellPowerEffect: GenerateSpellPowerEffect = {
    type: SpellEffectType.GenerateSpellPower,
    amount: 100,
    spellId: "",
    id: ""
}

const DefaultAbsorbEffect: AbsorbShieldEffect = {
    type: SpellEffectType.AbsorbShield,
    spellId: "",
    id: "",
    name: "",
    shieldValue: 100,
    period: 1000,
    stack: 2,
    timeEffectType: TimeEffectType.BUFF,
    iconImage: ""
}

const DefaultTickOverTimeEffect: TickOverTimeEffect = {
    type: SpellEffectType.TickEffectOverTime,
    name: "",
    description: "",
    timeEffectType: TimeEffectType.BUFF,
    period: 1000,
    iconImage: "",
    activationFrequency: 1000,
    spellEffects: {},
    spellId: "",
    id: ""
}

const DefaultAreaEffect: AreaEffect = {
    type: SpellEffectType.Area,
    name: "",
    areaType: AreaType.Circle,
    period: 1000,
    radius: 1000,
    activationFrequency: 1000,
    spellEffects: {},
    spellId: "",
    id: ""
}

export const SpellDialog = () => {
    const { activeSpell, setActiveSpell } = useContext(SpellsContext);
    let defaultSpell = activeSpell?.id ? _.merge({}, DefaultSpell, activeSpell) : DefaultSpell;

    const spellEffectsSchema: Schema = {
        type: {
            label: "Effect type",
            type: SchemaFieldType.Select,
            options: [
                { label: "Damage", value: SpellEffectType.Damage },
                { label: "Heal", value: SpellEffectType.Heal },
                { label: "Generate Spell Power", value: SpellEffectType.GenerateSpellPower },
                { label: "Absorb Shield", value: SpellEffectType.AbsorbShield },
                { label: "Tick Effect Over Time", value: SpellEffectType.TickEffectOverTime },
                { label: "Area", value: SpellEffectType.Area },
            ],
            typeChanger: {
                [SpellEffectType.Damage]: DefaultDamageEffect,
                [SpellEffectType.Heal]: DefaultHealEffect,
                [SpellEffectType.GenerateSpellPower]: DefaultGenerateSpellPowerEffect,
                [SpellEffectType.AbsorbShield]: DefaultAbsorbEffect,
                [SpellEffectType.TickEffectOverTime]: DefaultTickOverTimeEffect,
                [SpellEffectType.Area]: DefaultAreaEffect
            }
        },
        amount: {
            label: "Amount (percentage from the attribute)",
            type: SchemaFieldType.Number,
            conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
            prerequisite: ({ type }) => [
                SpellEffectType.Damage,
                SpellEffectType.Heal,
                SpellEffectType.GenerateSpellPower
            ].includes(type)
        },
        attribute: {
            label: "Attribute",
            type: SchemaFieldType.Select,
            options: [
                { label: "Stamina", value: Attribute.Stamina },
                { label: "Strength", value: Attribute.Strength },
                { label: "Agility", value: Attribute.Agility },
                { label: "Intelect", value: Attribute.Intelect },
                { label: "Spirit", value: Attribute.Spirit },
            ],
            prerequisite: ({ type }) => [
                SpellEffectType.Damage,
            ].includes(type)
        },
        spellId: {
            type: SchemaFieldType.Text,
            hidden: true
        },
        id: {
            type: SchemaFieldType.Text,
            hidden: true
        },
        name: {
            label: "Buff name",
            type: SchemaFieldType.Text,
            conditions: [{ type: FormFieldConditions.Required }],
            prerequisite: ({ type }) => [
                SpellEffectType.AbsorbShield,
                SpellEffectType.TickEffectOverTime
            ].includes(type)
        },
        description: {
            label: "Description",
            type: SchemaFieldType.Text,
            prerequisite: ({ type }) => [
                SpellEffectType.TickEffectOverTime
            ].includes(type)
        },
        shieldValue: {
            label: "Shield value",
            type: SchemaFieldType.Number,
            conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
            prerequisite: ({ type }) => [
                SpellEffectType.AbsorbShield
            ].includes(type)
        },
        activationFrequency: {
            label: "Activation Frequency (in milliseconds)",
            type: SchemaFieldType.Number,
            conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
            prerequisite: ({ type }) => [
                SpellEffectType.TickEffectOverTime,
                SpellEffectType.Area
            ].includes(type)
        },
        period: {
            label: "Period",
            type: SchemaFieldType.Number,
            conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
            prerequisite: ({ type }) => [
                SpellEffectType.AbsorbShield,
                SpellEffectType.TickEffectOverTime,
                SpellEffectType.Area
            ].includes(type)
        },
        stack: {
            label: "Stack",
            type: SchemaFieldType.Number,
            conditions: [{ type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
            prerequisite: ({ type }) => [
                SpellEffectType.AbsorbShield
            ].includes(type)
        },
        iconImage: {
            label: "Icon Image",
            type: SchemaFieldType.Text,
            conditions: [{ type: FormFieldConditions.Required }],
            prerequisite: ({ type }) => [
                SpellEffectType.AbsorbShield,
                SpellEffectType.TickEffectOverTime
            ].includes(type)
        },
        timeEffectType: {
            label: "Time effect type",
            type: SchemaFieldType.Select,
            options: [
                { label: "Buff", value: TimeEffectType.BUFF },
                { label: "Debuff", value: TimeEffectType.DEBUFF }
            ],
            prerequisite: ({ type }) => [
                SpellEffectType.AbsorbShield,
                SpellEffectType.TickEffectOverTime
            ].includes(type)
        },
        areaType: {
            label: "Area type",
            type: SchemaFieldType.Text,
            prerequisite: ({ type }) => [
                SpellEffectType.Area
            ].includes(type),
            hidden: true
        },
        radius: {
            label: "Radius",
            type: SchemaFieldType.Number,
            conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
            prerequisite: ({ type }) => [
                SpellEffectType.Area
            ].includes(type)
        },
        spellEffects: {
            label: "Spell effects on activation",
            type: SchemaFieldType.Record,
            newElement: _.cloneDeep(DefaultDamageEffect),
            prerequisite: ({ type }) => [
                SpellEffectType.TickEffectOverTime,
                SpellEffectType.Area
            ].includes(type),
            schema: {
                type: {
                    label: "Effect type",
                    type: SchemaFieldType.Select,
                    options: [
                        { label: "Damage", value: SpellEffectType.Damage },
                        { label: "Heal", value: SpellEffectType.Heal },
                    ],
                    typeChanger: {
                        [SpellEffectType.Damage]: DefaultDamageEffect,
                        [SpellEffectType.Heal]: DefaultHealEffect
                    }
                },
                amount: {
                    label: "Amount (percentage from the attribute)",
                    type: SchemaFieldType.Number,
                    conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber }],
                    prerequisite: ({ type }) => [
                        SpellEffectType.Damage,
                        SpellEffectType.Heal
                    ].includes(type)
                },
                attribute: {
                    label: "Attribute",
                    type: SchemaFieldType.Select,
                    options: [
                        { label: "Stamina", value: Attribute.Stamina },
                        { label: "Strength", value: Attribute.Strength },
                        { label: "Agility", value: Attribute.Agility },
                        { label: "Intelect", value: Attribute.Intelect },
                        { label: "Spirit", value: Attribute.Spirit },
                    ],
                    prerequisite: ({ type }) => [
                        SpellEffectType.Damage,
                    ].includes(type)
                },
                spellId: {
                    type: SchemaFieldType.Text,
                    hidden: true
                },
                id: {
                    type: SchemaFieldType.Text,
                    hidden: true
                },
            }
        },
    };

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
                    { label: "DirectInstant", value: SpellType.DirectInstant },
                    { label: "Projectile", value: SpellType.Projectile },
                    { label: "GuidedProjectile", value: SpellType.GuidedProjectile },
                    { label: "Angle Blast", value: SpellType.AngleBlast },
                    { label: "Teleportation", value: SpellType.Teleportation }
                ],
                typeChanger: {
                    [SpellType.DirectInstant]: DefaultDirectInstant,
                    [SpellType.Projectile]: DefaultProjectile,
                    [SpellType.GuidedProjectile]: DefaultGuidedProjectile,
                    [SpellType.AngleBlast]: DefaultAngleBlast,
                    [SpellType.Teleportation]: DefaultTeleportation,
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
            casterImpact: {
                label: "Caster Impact",
                type: SchemaFieldType.Boolean,
                defaultValue: defaultSpell.casterImpact
            },
            monstersImpact: {
                label: "Monsters Impact",
                type: SchemaFieldType.Boolean,
                defaultValue: defaultSpell.monstersImpact
            },
            playersImpact: {
                label: "Players Impact",
                type: SchemaFieldType.Boolean,
                defaultValue: defaultSpell.playersImpact
            },
            speed: {
                label: "Speed",
                type: SchemaFieldType.Number,
                conditions: [{ type: FormFieldConditions.Required }, { type: FormFieldConditions.Number }, { type: FormFieldConditions.PositiveNumber },],
                defaultValue: (defaultSpell as ProjectileSubSpell).speed,
                prerequisite: ({ type }) => type === SpellType.Projectile || type === SpellType.GuidedProjectile
            },
            passThrough: {
                label: "Pass through",
                type: SchemaFieldType.Boolean,
                defaultValue: (defaultSpell as ProjectileSubSpell).passThrough,
                prerequisite: ({ type }) => type === SpellType.Projectile
            },
            angle: {
                label: "Angle (radians 0-3.14*2)",
                type: SchemaFieldType.Number,
                conditions: [
                    { type: FormFieldConditions.Required },
                    { type: FormFieldConditions.Number },
                    { type: FormFieldConditions.Range, min: 0, max: 7.28 }
                ],
                prerequisite: ({ type }) => type === SpellType.AngleBlast
            },
            //requiredPowerStacks
            spellEffectsOnTarget: {
                label: "Spell effects on target",
                type: SchemaFieldType.Record,
                newElement: _.cloneDeep(DefaultDamageEffect),
                defaultValue: defaultSpell.spellEffectsOnTarget,
                schema: spellEffectsSchema
            },
            spellEffectsOnCasterOnSpellHit: {
                label: "Spell effects on the caster when the target is hit",
                type: SchemaFieldType.Record,
                newElement: _.cloneDeep(DefaultDamageEffect),
                defaultValue: defaultSpell.spellEffectsOnCasterOnSpellHit,
                schema: spellEffectsSchema
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
