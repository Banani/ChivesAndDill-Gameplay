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
   Projectile: {
      type: SpellType.PROJECTILE,
      name: 'Projectile',
      range: 4000,
      speed: 40,
      damage: 69,
      cooldown: 500,
   },
   InstantProjectile: {
      type: SpellType.PROJECTILE,
      name: 'InstantProjectile',
      range: 1000,
      speed: 1000,
      damage: 69,
      cooldown: 500,
   },
};
