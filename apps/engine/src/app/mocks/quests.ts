import { KillingQuestStagePartComparison, QuestSchema, QuestType } from '@bananos/types';

export const MockedQuests: Record<string, QuestSchema> = {
    '1': {
        id: '1',
        name: "A Wee Bit O' Cloth",
        description:
            "Player, is that you I hear rustlin' about out there? It's me, Angus Stormbrew! There are cultists everywhere, so ye best keep yer voice down. Lean in close and cover yer nose while we talk! This is the only outhouse in all o' Silithus! Trust me I spent hours lookin' all through the night. I decided to sneak in for a wee drop-off before the cultists woke up, but I've got a uhh problem... There's no cloth to... you know... See if ye can find me a wee bit o' cloth and sneak it in through the door!",
        stageOrder: ['1', '2'],
        stages: {
            '1': {
                id: '1',
                description: 'Go to Twilight Outpost',
                stageParts: {
                    '1': {
                        id: '1',
                        questId: '1',
                        stageId: '1',
                        locationName: 'Twilight Outpost',
                        type: QuestType.MOVEMENT,
                        targetLocation: {
                            x: 200,
                            y: 200,
                        },
                        acceptableRange: 50,
                    },
                    '2': {
                        id: '2',
                        questId: '1',
                        stageId: '1',
                        monsterName: 'Orc Spearmen',
                        type: QuestType.KILLING,
                        rule: [{ comparison: KillingQuestStagePartComparison.equality, fieldName: 'division', value: 'OrcSpearman' }],
                        amount: 6,
                    },
                },
            },
            '2': {
                id: '2',
                description: 'Now it is time to fight',
                stageParts: {
                    '3': {
                        id: '3',
                        questId: '1',
                        stageId: '2',
                        monsterName: 'Orc Spearmen',
                        type: QuestType.KILLING,
                        rule: [{ comparison: KillingQuestStagePartComparison.equality, fieldName: 'division', value: 'OrcSpearman' }],
                        amount: 6,
                    },
                    '4': {
                        id: '4',
                        questId: '1',
                        stageId: '2',
                        monsterName: 'Orcs',
                        type: QuestType.KILLING,
                        rule: [{ comparison: KillingQuestStagePartComparison.equality, fieldName: 'division', value: 'Orc' }],
                        amount: 12,
                    },
                },
            },
        },
        questReward: {
            experience: 120,
            currency: 13221649,
            items: {
                "1": { itemTemplateId: '1', amount: 1 },
                "3": { itemTemplateId: '3', amount: 5 },
            },
        },
    },
    '2': {
        id: '2',
        name: "Carrot's for Adrian",
        description: 'Adrian needs carrots. Go hero and collect them. Now go, but remember if you failed all worlds will burn',
        stageOrder: ['3'],
        stages: {
            '3': {
                id: '3',
                description: 'Kill rabbits who stole carrots from farmer Adrian',
                stageParts: {
                    '4': {
                        id: '4',
                        questId: '2',
                        stageId: '3',
                        monsterName: 'Orc Spearmen',
                        type: QuestType.KILLING,
                        rule: [{ comparison: KillingQuestStagePartComparison.equality, fieldName: 'division', value: 'Orc' }],
                        amount: 2,
                    },
                },
            },
        },
        questReward: {
            experience: 100,
        },
    },
};
