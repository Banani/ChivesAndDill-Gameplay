import { MonsterTemplate } from "../modules/MonsterModule/MonsterTemplates";

export const MockedMonsterTemplates: Record<string, MonsterTemplate> = {
    "1": {
        id: '1',
        name: "Monster_name",
        healthPoints: 100,
        healthPointsRegeneration: 0,
        spellPower: 0,
        spellPowerRegeneration: 0,
        movementSpeed: 10,
        sightRange: 100,
        desiredRange: 0,
        escapeRange: 0,
        attackFrequency: 100,
        spells: {},
        dropSchema: {
            coins: {
                dropChance: 0.9,
                maxAmount: 30,
                minAmount: 0,
            },
            items: {
                '1': {
                    itemTemplateId: '1',
                    dropChance: 1,
                    maxAmount: 1,
                    minAmount: 1,
                },
                '2': {
                    itemTemplateId: '2',
                    dropChance: 1,
                    maxAmount: 1,
                    minAmount: 1,
                },
            }
        },
        quotesEvents: {
            standard: { chance: 1, quotes: ["Zjadłbym zupe pomidorową Kamila, była super"] },
            onKilling: { chance: 1, quotes: ["Pfff... ledwie go uderzyłem"] },
            onDying: { chance: 1, quotes: ["Tylko nie to..."] },
            onPulling: { chance: 1, quotes: ["Zgniotę Cie jak truskaweczke"] }
        },
        sprites: 'orc',
        avatar: '',
        size: 96
    }
}