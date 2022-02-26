import { DropItem, items } from '../ItemModule/Items';
import { ALL_SPELLS } from '../SpellModule/spells';
import type { Spell } from '../SpellModule/types/spellTypes';

export interface DropSchema {
   item: DropItem;
   dropChance: number;
   maxAmount: number;
   minAmount: number;
}

export interface MonsterTemplate {
   id: string;
   name: string;
   sprites: string;
   avatar: string;
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
   healthPointsRegen: number;
   spellPowerRegen: number;
   dropSchema?: DropSchema[];
}

export const MonsterTemplates: Record<string, MonsterTemplate> = {
   Orc: {
      id: 'Orc',
      name: 'Orc',
      sprites: 'orc',
      avatar: '../../../../assets/spritesheets/avatars/orcAvatar.png',
      size: 96,
      healthPoints: 60,
      spellPower: 100,
      speed: 8,
      division: 'Orc',
      sightRange: 200,
      desiredRange: 50,
      escapeRange: 2000,
      attackFrequency: 1500,
      healthPointsRegen: 5,
      spellPowerRegen: 5,
      spells: {
         Teleportation: ALL_SPELLS['Teleportation'],
         MonsterProjectile: ALL_SPELLS['MonsterProjectile'],
         MonsterInstant1: ALL_SPELLS['MonsterInstant1'],
         MonsterInstant2: ALL_SPELLS['MonsterInstant2'],
      },
      dropSchema: [
         {
            item: items['money'],
            dropChance: 0.9,
            maxAmount: 30,
            minAmount: 0,
         },
      ],
   },
   OrcSpearman: {
      id: 'OrcSpearman',
      name: 'OrcSpearman',
      sprites: 'orcSpearman',
      avatar: '../../../../assets/spritesheets/avatars/orcSpearmanAvatar.png',
      size: 96,
      healthPoints: 200,
      spellPower: 100,
      division: 'OrcSpearman',
      speed: 8,
      sightRange: 200,
      desiredRange: 200,
      escapeRange: 2000,
      attackFrequency: 500,
      healthPointsRegen: 5,
      spellPowerRegen: 5,
      spells: {
         MonsterProjectile: ALL_SPELLS['MonsterProjectile'],
         MonsterInstant1: ALL_SPELLS['MonsterInstant1'],
      },
   },
   WorldDestroyer: {
      id: 'WorldDestroyer',
      name: 'WorldDestroyer',
      sprites: 'demon',
      avatar: '../../../../assets/spritesheets/avatars/demonAvatar.png',
      size: 96,
      healthPoints: 20000,
      spellPower: 10000,
      speed: 6,
      sightRange: 200,
      desiredRange: 50,
      escapeRange: 2000,
      attackFrequency: 900,
      healthPointsRegen: 5,
      spellPowerRegen: 5,
      spells: {
         DestroyerBasic: ALL_SPELLS['DestroyerBasic'],
      },
   },
};
