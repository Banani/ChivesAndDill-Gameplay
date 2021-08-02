import { KillingQuestStagePartComparison, Quest, QuestResetEvent, QuestType } from './types';

export const Quests: Record<string, Quest> = {
   '1': {
      id: '1',
      name: 'A hero rises',
      description: 'A hero needs to rise.',
      stageOrder: ['1', '2'],
      stages: {
         '1': {
            id: '1',
            description: 'Hero should start from going to 200x200',
            stageParts: {
               '1': {
                  id: '1',
                  questId: '1',
                  stageId: '1',
                  type: QuestType.MOVEMENT,
                  targetLocation: {
                     x: 200,
                     y: 200,
                  },
                  acceptableRange: 50,
               },
            },
         },
         '2': {
            id: '2',
            description: 'Now it is time to fight',
            stageParts: {
               '2': {
                  id: '2',
                  questId: '1',
                  stageId: '2',
                  type: QuestType.KILLING,
                  resetConditions: [{ type: QuestResetEvent.PlayerLostHp }],
                  rule: [{ comparison: KillingQuestStagePartComparison.equality, fieldName: 'division', value: 'PigFucker' }],
                  amount: 6,
               },
               '3': {
                  id: '3',
                  questId: '1',
                  stageId: '2',
                  type: QuestType.KILLING,
                  rule: [{ comparison: KillingQuestStagePartComparison.equality, fieldName: 'division', value: 'PigSlut' }],
                  amount: 12,
               },
            },
         },
      },
   },
   '2': {
      id: '2',
      name: 'Carrots for Adrian',
      description: 'Adrian needs carrots. Go hero and collect them, but remember if you failed all worlds will burn',
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
                  type: QuestType.KILLING,
                  rule: [{ comparison: KillingQuestStagePartComparison.equality, fieldName: 'division', value: 'PigFucker' }],
                  amount: 6,
               },
            },
         },
      },
   },
};
