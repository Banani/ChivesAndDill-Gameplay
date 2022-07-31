import type { ItemTemplate } from '@bananos/types';
import { CharacterDirection } from '@bananos/types';
import { ItemTemplates } from '../ItemModule/ItemTemplates';
import type { Spell } from '../SpellModule/types/SpellTypes';

export interface NpcTemplate {
   id: string;
   name: string;
   sprites: string;
   avatar: string;
   size: number;
   healthPoints: number;
   spellPower: number;
   speed: number;
   direction: CharacterDirection;
   isInMove: boolean;
   healthPointsRegen: number;
   spellPowerRegen: number;
   spells: Record<string, Spell>;
   stock?: Record<string, ItemTemplate>;
}

export const NpcTemplates: Record<string, NpcTemplate> = {
   Manczur: {
      id: 'Manczur',
      name: 'Mańczur',
      sprites: 'citizen',
      avatar: 'https://www.colorland.pl/sites/default/files/article-image/kot1_1.jpg',
      size: 96,
      healthPoints: 100,
      spellPower: 100,
      speed: 8,
      direction: CharacterDirection.DOWN,
      isInMove: false,
      healthPointsRegen: 5,
      spellPowerRegen: 5,
      spells: {},
      stock: {
         '1': ItemTemplates['1'],
         '2': ItemTemplates['2'],
         '4': ItemTemplates['4'],
         '5': ItemTemplates['5'],
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
      speed: 8,
      direction: CharacterDirection.DOWN,
      isInMove: false,
      healthPointsRegen: 5,
      spellPowerRegen: 5,
      spells: {},
   },
};
