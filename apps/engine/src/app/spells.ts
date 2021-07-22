import { AreaType, SpellEffectType, SpellType } from './SpellType';
import { Spell } from './types/Spell';

export const ALL_SPELLS: Record<string, Spell> = {
   test: {
      type: SpellType.Projectile,
      name: 'test',
      range: 4000,
      areaType: AreaType.Circle,
      cooldown: 500,
      radius: 200,
      speed: 15,
      spellPowerCost: 10,
      angle: Math.PI / 3,
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Damage,
            amount: 10,
         },
      ],
      spellEffectsOnDirectionLocation: [],
      spellEffectsOnCaster: [
         {
            type: SpellEffectType.GenerateSpellPower,
            amount: 5,
         },
      ],
   },
   DirectHit: {
      type: SpellType.DirectInstant,
      name: 'DirectHit',
      range: 400,
      spellPowerCost: 10,
      cooldown: 1000,
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Damage,
            amount: 10,
         },
      ],
      spellEffectsOnDirectionLocation: [
         {
            type: SpellEffectType.Area,
            areaType: AreaType.Circle,
            radius: 200,
            period: 1000 * 10,
            attackFrequency: 200,
            spellEffects: [
               {
                  type: SpellEffectType.Damage,
                  amount: 1,
               },
            ],
         },
      ],
      spellEffectsOnCaster: [],
   },
   Projectile: {
      type: SpellType.Projectile,
      name: 'Projectile',
      range: 4000,
      spellPowerCost: 10,
      speed: 4,
      cooldown: 0,
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Heal,
            amount: 100,
         },
      ],
      spellEffectsOnDirectionLocation: [],
      spellEffectsOnCaster: [],
   },
   MonsterProjectile: {
      type: SpellType.Projectile,
      name: 'MonsterProjectile',
      range: 1000,
      spellPowerCost: 10,
      speed: 40,
      cooldown: 2000,
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Damage,
            amount: 10,
         },
      ],
      spellEffectsOnDirectionLocation: [],
      spellEffectsOnCaster: [],
   },
   MonsterInstant1: {
      type: SpellType.DirectInstant,
      name: 'MonsterInstant1',
      range: 500,
      spellPowerCost: 10,
      cooldown: 1000,
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Damage,
            amount: 10,
         },
      ],
      spellEffectsOnDirectionLocation: [],
      spellEffectsOnCaster: [],
   },
   MonsterInstant2: {
      type: SpellType.DirectInstant,
      name: 'MonsterInstant2',
      range: 1500,
      spellPowerCost: 10,
      cooldown: 1000,
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Damage,
            amount: 5,
         },
      ],
      spellEffectsOnDirectionLocation: [],
      spellEffectsOnCaster: [],
   },
   InstantProjectile: {
      type: SpellType.Projectile,
      name: 'InstantProjectile',
      range: 1000,
      spellPowerCost: 10,
      speed: 1000,
      cooldown: 0,
      spellEffectsOnTarget: [],
      spellEffectsOnDirectionLocation: [],
      spellEffectsOnCaster: [],
   },
};
