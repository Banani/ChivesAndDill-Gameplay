import { CharacterRespawn, WalkingType } from '../../types/CharacterRespawn';
import { MonsterTemplate, MonsterTemplates } from './MonsterTemplates';

export const MonsterRespawns: Record<string, CharacterRespawn<MonsterTemplate>> = {
   //    '1': {
   //       id: '1',
   //       location: { x: 1300, y: 800 },
   //       characterTemplate: MonsterTemplates['WorldDestroyer'],
   //       time: 5000,
   //       walkingType: WalkingType.None,
   //    },
   //    '1': {
   //       id: '1',
   //       location: { x: 1300, y: 800 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '2': {
   //       id: '2',
   //       location: { x: 1350, y: 800 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '3': {
   //       id: '3',
   //       location: { x: 1400, y: 800 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '4': {
   //       id: '4',
   //       location: { x: 1450, y: 800 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },

   '5': {
      id: '5',
      location: { x: 300, y: 400 },
      characterTemplate: MonsterTemplates['Orc'],
      time: 10000,
      walkingType: WalkingType.None,
   },
   '6': {
      id: '6',
      location: { x: 1300, y: 850 },
      characterTemplate: MonsterTemplates['OrcSpearman'],
      walkingType: WalkingType.Patrol,
      patrolPath: [
         { x: 1100, y: 950 },
         { x: 1900, y: 950 },
      ],
      time: 2000,
   },
   '7': {
      id: '7',
      location: { x: 1450, y: 850 },
      characterTemplate: MonsterTemplates['OrcSpearman'],
      walkingType: WalkingType.Patrol,
      patrolPath: [
         { x: 1100, y: 950 },
         { x: 1900, y: 950 },
      ],
      time: 2000,
   },
   '8': {
      id: '8',
      location: { x: 1450, y: 1000 },
      characterTemplate: MonsterTemplates['OrcSpearman'],
      walkingType: WalkingType.Patrol,
      patrolPath: [
         { x: 1100, y: 950 },
         { x: 1900, y: 950 },
      ],
      time: 2000,
   },
   //    '9': {
   //       id: '9',
   //       location: { x: 1600, y: 850 },
   //       characterTemplate: MonsterTemplates['OrcSpearman'],
   //       walkingType: WalkingType.Patrol,
   //       patrolPath: [
   //          { x: 1100, y: 950 },
   //          { x: 1900, y: 950 },
   //       ],
   //       time: 2000,
   //    },
   //    '10': {
   //       id: '10',
   //       location: { x: 1600, y: 1000 },
   //       characterTemplate: MonsterTemplates['OrcSpearman'],
   //       time: 2000,
   //       walkingType: WalkingType.Patrol,
   //       patrolPath: [
   //          {
   //             x: 1100,
   //             y: 800,
   //          },
   //          {
   //             x: 1100,
   //             y: 1100,
   //          },
   //          {
   //             x: 1900,
   //             y: 1100,
   //          },
   //          {
   //             x: 1900,
   //             y: 800,
   //          },
   //       ],
   //    },

   '11': {
      id: '11',
      location: { x: 1300, y: 900 },
      characterTemplate: MonsterTemplates['OrcSpearman'],
      time: 2000,
      walkingType: WalkingType.Patrol,
      patrolPath: [
         {
            x: 1100,
            y: 800,
         },
         {
            x: 1100,
            y: 1100,
         },
         {
            x: 1900,
            y: 1100,
         },
         {
            x: 1900,
            y: 800,
         },
      ],
   },
   //    '12': {
   //       id: '12',
   //       location: { x: 1350, y: 900 },
   //       characterTemplate: MonsterTemplates['OrcSpearman'],
   //       time: 2000,
   //       walkingType: WalkingType.Patrol,
   //       patrolPath: [
   //          {
   //             x: 1100,
   //             y: 800,
   //          },
   //          {
   //             x: 1100,
   //             y: 1100,
   //          },
   //          {
   //             x: 1900,
   //             y: 1100,
   //          },
   //          {
   //             x: 1900,
   //             y: 800,
   //          },
   //       ],
   //    },
   //    '13': {
   //       id: '13',
   //       location: { x: 1400, y: 900 },
   //       characterTemplate: MonsterTemplates['OrcSpearman'],
   //       time: 2000,
   //       walkingType: WalkingType.Patrol,
   //       patrolPath: [
   //          {
   //             x: 1100,
   //             y: 800,
   //          },
   //          {
   //             x: 1100,
   //             y: 1100,
   //          },
   //          {
   //             x: 1900,
   //             y: 1100,
   //          },
   //          {
   //             x: 1900,
   //             y: 800,
   //          },
   //       ],
   //    },
   //    '14': {
   //       id: '14',
   //       location: { x: 1450, y: 900 },
   //       characterTemplate: MonsterTemplates['WorldDestroyer'],
   //       time: 2000,
   //       walkingType: WalkingType.Patrol,
   //       patrolPath: [
   //          {
   //             x: 1100,
   //             y: 800,
   //          },
   //          {
   //             x: 1100,
   //             y: 1100,
   //          },
   //          {
   //             x: 1900,
   //             y: 1100,
   //          },
   //          {
   //             x: 1900,
   //             y: 800,
   //          },
   //       ],
   //    },
   //    '15': {
   //       id: '15',
   //       location: { x: 1500, y: 900 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },

   //    '16': {
   //       id: '16',
   //       location: { x: 1300, y: 950 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '17': {
   //       id: '17',
   //       location: { x: 1350, y: 950 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '18': {
   //       id: '18',
   //       location: { x: 1400, y: 950 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '19': {
   //       id: '19',
   //       location: { x: 1450, y: 950 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '20': {
   //       id: '20',
   //       location: { x: 1500, y: 950 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },

   //    '21': {
   //       id: '21',
   //       location: { x: 1300, y: 1000 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '22': {
   //       id: '22',
   //       location: { x: 1350, y: 1000 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '23': {
   //       id: '23',
   //       location: { x: 1400, y: 1000 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '24': {
   //       id: '24',
   //       location: { x: 1450, y: 1000 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '25': {
   //       id: '25',
   //       location: { x: 1500, y: 1000 },
   //       characterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
};
