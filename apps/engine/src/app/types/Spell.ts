import { SpellType } from '../SpellType';

export interface Spell {
  type: SpellType.DIRECT_HIT;
  name: string;
  range: number;
  speed: number;
  damage: number;
  cooldown: number;
}
