import { Attribute, Spell, SpellEffectType, SpellType } from '@bananos/types';

export const MockedSpells: Record<string, Spell> = {
    '1': {
        id: "1",
        type: SpellType.DirectInstant,
        name: 'BasicAttack',
        range: 100,
        spellPowerCost: 100,
        cooldown: 0,
        image: '',
        description: '',
        casterImpact: true,
        monstersImpact: true,
        playersImpact: true,
        spellEffectsOnTarget: {
            '1': {
                id: "543534",
                spellId: "1",
                type: SpellEffectType.Damage,
                amount: 100,
                attribute: Attribute.Strength
            },
        },
    },
    '2': {
        id: "2",
        type: SpellType.DirectInstant,
        name: 'BasicAttack_2',
        range: 100,
        spellPowerCost: 100,
        cooldown: 0,
        image: '',
        description: '',
        casterImpact: true,
        monstersImpact: true,
        playersImpact: true,
        spellEffectsOnTarget: {
            '1': {
                id: "525342",
                spellId: "2",
                type: SpellEffectType.Damage,
                amount: 100,
                attribute: Attribute.Strength
            },
        },
    },
    '3': {
        id: "3",
        type: SpellType.GuidedProjectile,
        name: 'BasicAttack_3',
        range: 100,
        spellPowerCost: 100,
        cooldown: 0,
        image: '',
        description: '',
        casterImpact: true,
        monstersImpact: true,
        playersImpact: true,
        spellEffectsOnTarget: {
            '1': {
                id: "121221",
                spellId: "3",
                type: SpellEffectType.Damage,
                amount: 100,
                attribute: Attribute.Strength
            },
        },
        speed: 30
    },
    '4': {
        id: "4",
        type: SpellType.AngleBlast,
        name: 'Angle blast damage',
        range: 300,
        spellPowerCost: 100,
        cooldown: 0,
        image: '',
        description: '',
        casterImpact: false,
        monstersImpact: true,
        playersImpact: true,
        angle: 2,
        effectSpread: true,
        spellEffectsOnTarget: {
            '1': {
                id: "4.1",
                spellId: "4",
                type: SpellEffectType.Damage,
                amount: 100,
                attribute: Attribute.Strength
            },
        },
    },
    '5': {
        id: "5",
        type: SpellType.AngleBlast,
        name: 'Angle blast heal',
        range: 300,
        spellPowerCost: 0,
        cooldown: 0,
        image: '',
        description: '',
        casterImpact: false,
        monstersImpact: true,
        playersImpact: true,
        angle: 2,
        effectSpread: true,
        spellEffectsOnTarget: {
            '1': {
                id: "5.1",
                spellId: "5",
                type: SpellEffectType.Heal,
                amount: 100
            },
        },
    },
};

