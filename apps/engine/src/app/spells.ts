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
      damage: 40,
      cooldown: 0,
   },
   MonsterProjectile: {
      type: SpellType.PROJECTILE,
      name: 'MonsterProjectile',
      range: 1000,
      speed: 40,
      damage: 20,
      cooldown: 2000,
   },
   MonsterInstant1: {
      type: SpellType.DIRECT_HIT,
      name: 'MonsterInstant1',
      range: 500,
      speed: 40,
      damage: 15,
      cooldown: 1000,
   },
   MonsterInstant2: {
      type: SpellType.DIRECT_HIT,
      name: 'MonsterInstant2',
      range: 1500,
      speed: 40,
      damage: 1,
      cooldown: 1000,
   },
   InstantProjectile: {
      type: SpellType.PROJECTILE,
      name: 'InstantProjectile',
      range: 1000,
      speed: 1000,
      damage: 69,
      cooldown: 0,
   },
};
