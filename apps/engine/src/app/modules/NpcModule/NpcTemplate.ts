import { CharacterDirection, QuotesEvents, Spell } from '@bananos/types';
import { QuestSchema } from 'libs/types/src/QuestPackage';
import { Quests } from '../QuestModule/Quests';

export interface NpcTemplate {
    id: string;
    name: string;
    sprites: string;
    avatar: string;
    size: number;
    healthPoints: number;
    spellPower: number;
    movementSpeed: number;
    healthPointsRegeneration: number;
    spellPowerRegeneration: number;
    spells: Record<string, Spell>;
    stock?: Record<string, boolean>;
    quests?: Record<string, QuestSchema>;
    quotesEvents?: QuotesEvents;

    //TODO: Co to tutaj robi?
    isInMove: boolean;
    direction: CharacterDirection;
}

export const NpcTemplates: Record<string, NpcTemplate> = {
    Manczur: {
        id: 'Manczur',
        name: 'Mańczur',
        sprites: 'citizen',
        avatar: 'https://www.colorland.pl/storage/app/uploads/public/a29/0MV/8xL/a290MV8xLmpwZyExY2E4OTk4Zjg1M2ZmNzYxODgyNDhhNmMyZjU1MjI5Ng==.jpg',
        size: 96,
        healthPoints: 100,
        spellPower: 100,
        movementSpeed: 8,
        direction: CharacterDirection.DOWN,
        isInMove: false,
        healthPointsRegeneration: 5,
        spellPowerRegeneration: 5,
        spells: {},
        stock: {
            '1': true,
            '2': true,
            '4': true,
            '5': true,
            '3': true,
            '6': true,
            '7': true,
            '8': true,
            '9': true,
            '10': true,
            '11': true,
            '12': true,
            '13': true,
            '14': true,
        },
        quests: {
            '1': Quests['1'],
            '2': Quests['2'],
        },
        quotesEvents: {
            onDying: {
                chance: 0.5,
                quotes: ['Powiedz moim dzieciom ze je kochalem', 'Umieram, ale przynajmniej miałem okazje zobaczyc Mikolaja nago'],
            },
            standard: {
                chance: 0.2,
                quotes: [
                    'Kiedyś to było, a teraz to nie ma',
                    'A ta Zośka co zrobiła? Kto to widział',
                    'Znowu pogoda pod psem',
                    'Mikołaj to jest jednak równy chłop',
                    'Uciekaj, słabeuszu',
                    'Prawdziwa siła',
                    'Niezrównana potęga',
                    'Mój cel jest jasny',
                    'Nie pokazuj pleców, ani nie odkrywaj szyi',
                    'Siła nade wszystko”',
                    'Nie toleruję tchórzostwa',
                ],
            },
        },
    },
    KretonPL: {
        id: 'KretonPL',
        name: 'KretonPL',
        sprites: 'citizen',
        avatar: 'https://avatars.githubusercontent.com/u/5495772?v=4',
        size: 96,
        healthPoints: 100,
        spellPower: 100,
        movementSpeed: 8,
        direction: CharacterDirection.DOWN,
        isInMove: false,
        healthPointsRegeneration: 5,
        spellPowerRegeneration: 5,
        spells: {},
    },
};
