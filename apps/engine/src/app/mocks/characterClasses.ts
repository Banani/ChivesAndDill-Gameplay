import { CharacterClass } from '@bananos/types';

export const MockedCharacterClasses: Record<string, CharacterClass> = {
    '1': {
        id: '1',
        name: "Tank",
        iconImage: "",
        healthPoints: 200,
        spellPower: 100,
        spells: {
            '1': {
                spellId: "1",
                minLevel: 0
            },
            '3': {
                spellId: "3",
                minLevel: 0
            },
            '4': {
                spellId: "4",
                minLevel: 0
            },
            '5': {
                spellId: "5",
                minLevel: 0
            },
        },
        color: ""
    },
};

