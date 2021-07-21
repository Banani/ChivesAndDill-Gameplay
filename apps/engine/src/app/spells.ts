import { SpellEffectType, SpellType } from './SpellType';
import { Spell } from './types/Spell';

export const ALL_SPELLS: Record<string, Spell> = {
   test: {
      type: SpellType.Projectile,
      name: 'test',
      range: 400,
      speed: 10,
      cooldown: 500,
      spellEffects: [
         {
            type: SpellEffectType.Heal,
            amount: 50,
         },
      ],
   },
   DirectHit: {
      type: SpellType.DirectInstant,
      name: 'DirectHit',
      range: 400,
      cooldown: 1000,
      spellEffects: [],
   },
   Projectile: {
      type: SpellType.Projectile,
      name: 'Projectile',
      range: 4000,
      speed: 40,
      cooldown: 0,
      spellEffects: [],
   },
   MonsterProjectile: {
      type: SpellType.Projectile,
      name: 'MonsterProjectile',
      range: 1000,
      speed: 40,
      cooldown: 2000,
      spellEffects: [
         {
            type: SpellEffectType.Damage,
            amount: 10,
         },
      ],
   },
   MonsterInstant1: {
      type: SpellType.DirectInstant,
      name: 'MonsterInstant1',
      range: 500,
      cooldown: 1000,
      spellEffects: [
         {
            type: SpellEffectType.Damage,
            amount: 10,
         },
      ],
   },
   MonsterInstant2: {
      type: SpellType.DirectInstant,
      name: 'MonsterInstant2',
      range: 1500,
      cooldown: 1000,
      spellEffects: [
         {
            type: SpellEffectType.Damage,
            amount: 5,
         },
      ],
   },
   InstantProjectile: {
      type: SpellType.Projectile,
      name: 'InstantProjectile',
      range: 1000,
      speed: 1000,
      cooldown: 0,
      spellEffects: [],
   },
};
