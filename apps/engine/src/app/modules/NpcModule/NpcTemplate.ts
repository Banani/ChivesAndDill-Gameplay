import { CharacterDirection } from '@bananos/types';
import { Spell } from '../SpellModule/types/spellTypes';

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
}

export const NpcTemplates: Record<string, NpcTemplate> = {
   Manczur: {
      id: 'Manczur',
      name: 'Mańczur',
      sprites: 'citizen',
      avatar: '../../../../assets/spritesheets/avatars/dogAvatar.png',
      size: 50,
      healthPoints: 100,
      spellPower: 100,
      speed: 8,
      direction: CharacterDirection.DOWN,
      isInMove: false,
      healthPointsRegen: 5,
      spellPowerRegen: 5,
      spells: {},
   },
   Roberto: {
      id: 'Roberto',
      name: 'Roberto',
      sprites: 'citizen',
      avatar: '../../../../assets/spritesheets/avatars/dogAvatar.png',
      size: 50,
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
