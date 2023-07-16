import { CharacterClass } from '@bananos/types';

export const MockedCharacterClasses: Record<string, CharacterClass> = {
    '1': {
        id: '1',
        name: "Tank",
        iconImage: "",
        maxHp: 200,
        maxSpellPower: 100,
        spells: {
            '1': {
                spellId: "1",
                minLevel: 0
            },
            '3': {
                spellId: "3",
                minLevel: 0
            },
        },
        color: ""
    },
};

