import { ALL_SPELLS } from '../SpellModule/spells';
import { Spell } from '../SpellModule/types/spellTypes';

export interface MonsterTemplate {
   id: string;
   name: string;
   sprites: string;
   size: number;
   healthPoints: number;
   spellPower: number;
   division?: string;
   sightRange: number;
   desiredRange: number;
   speed: number;
   escapeRange: number;
   spells: Record<string, Spell>;
   attackFrequency: number;
}

export const MonsterTemplates: Record<string, MonsterTemplate> = {
   PigSlut: {
      id: 'PigSlut',
      name: 'PigSlut',
      sprites: 'pigMan',
      size: 50,
      healthPoints: 60,
      spellPower: 100,
      speed: 8,
      division: 'PigSlut',
      sightRange: 200,
      desiredRange: 50,
      escapeRange: 2000,
      attackFrequency: 1500,
      spells: {
         Teleportation: ALL_SPELLS['Teleportation'],
         MonsterProjectile: ALL_SPELLS['MonsterProjectile'],
         MonsterInstant1: ALL_SPELLS['MonsterInstant1'],
         MonsterInstant2: ALL_SPELLS['MonsterInstant2'],
      },
   },
   PigFucker: {
      id: 'PigFucker',
      name: 'PigFucker',
      sprites: 'pigMan',
      size: 50,
      healthPoints: 200,
      spellPower: 100,
      division: 'PigFucker',
      speed: 8,
      sightRange: 200,
      desiredRange: 200,
      escapeRange: 2000,
      attackFrequency: 500,
      spells: {
         MonsterProjectile: ALL_SPELLS['MonsterProjectile'],
         MonsterInstant1: ALL_SPELLS['MonsterInstant1'],
      },
   },
   WorldDestroyer: {
      id: 'WorldDestroyer',
      name: 'WorldDestroyer',
      sprites: 'pigMan',
      size: 50,
      healthPoints: 20000,
      spellPower: 10000,
      speed: 6,
      sightRange: 200,
      desiredRange: 50,
      escapeRange: 2000,
      attackFrequency: 900,
      spells: {
         DestroyerBasic: ALL_SPELLS['DestroyerBasic'],
      },
   },
};
