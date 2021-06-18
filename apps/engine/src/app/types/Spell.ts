import { SpellType } from '../SpellType';

export interface Spell {
   type: SpellType;
   name: string;
   range: number;
   speed: number;
   damage: number;
   cooldown: number;
}
