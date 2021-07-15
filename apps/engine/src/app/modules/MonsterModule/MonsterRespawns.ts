import { Location } from '../../types';
import { MonsterTemplate, MonsterTemplates } from './MonsterTemplates';

export interface MonsterRespawn {
   location: Location;
   monsterTemplate: MonsterTemplate;
   time: number;
   id: string;
}

export const MonsterRespawns = {
   '1': {
      id: '1',
      location: { x: 1300, y: 960 },
      monsterTemplate: MonsterTemplates['PigSlut'],
      time: 1000 * 10,
   },
   '2': {
      id: '2',
      location: { x: 1350, y: 960 },
      monsterTemplate: MonsterTemplates['PigSlut'],
      time: 1000 * 10,
   },
   '3': {
      id: '3',
      location: { x: 1250, y: 1010 },
      monsterTemplate: MonsterTemplates['PigSlut'],
      time: 1000 * 10,
   },
   '4': {
      id: '4',
      location: { x: 1250, y: 960 },
      monsterTemplate: MonsterTemplates['PigSlut'],
      time: 1000 * 10,
   },
   '5': {
      id: '5',
      location: { x: 150, y: 100 },
      monsterTemplate: MonsterTemplates['PigSlut'],
      time: 1000 * 10,
   },
   '6': {
      id: '6',
      location: { x: 1450, y: 1060 },
      monsterTemplate: MonsterTemplates['PigSlut'],
      time: 1000 * 10,
   },
   '7': {
      id: '7',
      location: { x: 1500, y: 960 },
      monsterTemplate: MonsterTemplates['PigSlut'],
      time: 1000 * 10,
   },
   '8': {
      id: '8',
      location: { x: 1250, y: 1160 },
      monsterTemplate: MonsterTemplates['PigSlut'],
      time: 1000 * 10,
   },
   '9': {
      id: '9',
      location: { x: 200, y: 100 },
      monsterTemplate: MonsterTemplates['PigSlut'],
      time: 1000 * 10,
   },
   '10': {
      id: '10',
      location: { x: 150, y: 150 },
      monsterTemplate: MonsterTemplates['PigSlut'],
      time: 1000 * 10,
   },
};
