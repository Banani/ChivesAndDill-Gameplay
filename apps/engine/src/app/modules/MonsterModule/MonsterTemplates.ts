import { ALL_SPELLS } from '../../spells';
import { SpellType } from '../../SpellType';
import { Spell } from '../../types/Spell';

export interface MonsterTemplate {
   id: string;
   name: string;
   sprites: string;
   size: number;
   healthPoints: number;
   division: string;
   sightRange: number;
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
      division: 'PigSlut',
      sightRange: 200,
      escapeRange: 2000,
      attackFrequency: 1500,
      spells: {
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
      division: 'PigFucker',
      sightRange: 200,
      escapeRange: 2000,
      attackFrequency: 500,
      spells: {
         MonsterProjectile: ALL_SPELLS['MonsterProjectile'],
         MonsterInstant1: ALL_SPELLS['MonsterInstant1'],
      },
   },
};
