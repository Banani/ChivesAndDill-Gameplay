import type { Location } from '../../types';
import type { MonsterTemplate} from './MonsterTemplates';
import { MonsterTemplates } from './MonsterTemplates';

export interface MonsterRespawn {
   location: Location;
   monsterTemplate: MonsterTemplate;
   time: number;
   id: string;
}

export const MonsterRespawns = {
   '1': {
      id: '1',
      location: { x: 1300, y: 800 },
      monsterTemplate: MonsterTemplates['WorldDestroyer'],
      time: 5000,
   },
   //    '1': {
   //       id: '1',
   //       location: { x: 1300, y: 800 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '2': {
   //       id: '2',
   //       location: { x: 1350, y: 800 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '3': {
   //       id: '3',
   //       location: { x: 1400, y: 800 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '4': {
   //       id: '4',
   //       location: { x: 1450, y: 800 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   '5': {
      id: '5',
      location: { x: 1300, y: 1000 },
      monsterTemplate: MonsterTemplates['Orc'],
      time: 2000,
   },
   //    '6': {
   //       id: '6',
   //       location: { x: 1300, y: 850 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '7': {
   //       id: '7',
   //       location: { x: 1450, y: 850 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '8': {
   //       id: '8',
   //       location: { x: 1450, y: 1000 },
   //       monsterTemplate: MonsterTemplates['PigFucker'],
   //       time: 2000,
   //    },
   //    '9': {
   //       id: '9',
   //       location: { x: 1600, y: 850 },
   //       monsterTemplate: MonsterTemplates['PigFucker'],
   //       time: 2000,
   //    },
   '10': {
      id: '10',
      location: { x: 1600, y: 1000 },
      monsterTemplate: MonsterTemplates['OrcSpearman'],
      time: 2000,
   },

   //    '11': {
   //       id: '11',
   //       location: { x: 1300, y: 900 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '12': {
   //       id: '12',
   //       location: { x: 1350, y: 900 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '13': {
   //       id: '13',
   //       location: { x: 1400, y: 900 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '14': {
   //       id: '14',
   //       location: { x: 1450, y: 900 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '15': {
   //       id: '15',
   //       location: { x: 1500, y: 900 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },

   //    '16': {
   //       id: '16',
   //       location: { x: 1300, y: 950 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '17': {
   //       id: '17',
   //       location: { x: 1350, y: 950 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '18': {
   //       id: '18',
   //       location: { x: 1400, y: 950 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '19': {
   //       id: '19',
   //       location: { x: 1450, y: 950 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '20': {
   //       id: '20',
   //       location: { x: 1500, y: 950 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },

   //    '21': {
   //       id: '21',
   //       location: { x: 1300, y: 1000 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '22': {
   //       id: '22',
   //       location: { x: 1350, y: 1000 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '23': {
   //       id: '23',
   //       location: { x: 1400, y: 1000 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '24': {
   //       id: '24',
   //       location: { x: 1450, y: 1000 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
   //    '25': {
   //       id: '25',
   //       location: { x: 1500, y: 1000 },
   //       monsterTemplate: MonsterTemplates['PigSlut'],
   //       time: 2000,
   //    },
};
