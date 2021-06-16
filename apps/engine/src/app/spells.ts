import { SpellType } from './SpellType';
import { Spell } from './types/Spell';

export const ALL_SPELLS: Record<string, Spell> = {
  DirectHit: {
    type: SpellType.DIRECT_HIT,
    name: 'DirectHit',
    range: 400,
    speed: 4,
    damage: 25,
    cooldown: 1000,
  },
};
