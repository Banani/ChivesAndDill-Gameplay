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
        spellEffectsOnTarget: {
            '1': {
                spellId: "2",
                type: SpellEffectType.Damage,
                amount: 100,
                attribute: Attribute.Strength
            },
        },
    },
};

