import type { SpellType } from '../SpellType';

export interface Spell {
   type: SpellType;
   name: string;
   range: number;
   speed: number;
   damage: number;
   cooldown: number;
   image: string;
   description: string;
}
