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
                spellId: "3",
                type: SpellEffectType.Damage,
                amount: 100,
                attribute: Attribute.Strength
            },
        },
        speed: 30
    },
};

