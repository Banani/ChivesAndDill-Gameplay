import { CharacterDirection, ItemTemplate } from '@bananos/types';
import { ItemTemplates } from '../ItemModule/ItemTemplates';
import { Spell } from '../SpellModule/types/SpellTypes';

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
      avatar:
         'https://scontent-waw1-1.xx.fbcdn.net/v/t1.15752-9/274123245_1090909568354124_1882313636197035257_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=ae9488&_nc_ohc=va14Kb-kYbMAX-4Y7eq&_nc_ht=scontent-waw1-1.xx&oh=03_AVJ9Ou0q3jx92EhKFu7ZUD5YkMUTpVIdLOPV1IJ4jZ4BTQ&oe=623B5D67',
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
