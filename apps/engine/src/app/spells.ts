import { AreaType, SpellEffectType, SpellType } from './SpellType';
import type { Spell } from './types/Spell';

export const ALL_SPELLS: Record<string, Spell> = {
   test: {
      type: SpellType.Area,
      name: 'test',
      range: 4000,
      spellPowerCost: 0,
      cooldown: 0,
      radius: 400,
      areaType: AreaType.Circle,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      description: 'Inflicts 40 Fire damage to an enemy and causes them to burn for 8 sec.',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.TickEffectOverTime,
            spellId: 'spell_123',
            period: 4000,
            activationFrequency: 200,
            spellEffects: [{ type: SpellEffectType.Damage, amount: 8 }],
         },
      ],
      spellEffectsOnCasterOnSpellHit: [],
   },
   ArcaneBarrage: {
      type: SpellType.Channel,
      name: 'ArcaneBarrage',
      range: 4000,
      spellPowerCost: 0,
      cooldown: 100,
      channelFrequency: 500,
      channelTime: 2500,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      description: 'Launches five waves of Arcane Missiles at the enemy over 2.5 sec, causing a total of 500 Arcane damage.',
      channelSpells: [
         {
            type: SpellType.Projectile,
            name: "ArcaneBarrage_projectile",
            range: 400,
            speed: 60,
            spellEffectsOnTarget: [
               {
                  type: SpellEffectType.Damage,
                  amount: 100,
               },
            ],
         },
      ],
   },
   DirectHit: {
      type: SpellType.DirectInstant,
      name: 'DirectHit',
      range: 400,
      spellPowerCost: 10,
      cooldown: 1000,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      description: 'Inflicts 25 Fire damage to an enemy and causes them to burn for 8 sec.',
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
   },
   Projectile: {
      type: SpellType.Projectile,
      name: 'Projectile',
      range: 4000,
      spellPowerCost: 0,
      speed: 40,
      cooldown: 0,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      description: 'Heal target for 250hp',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Heal,
            amount: 250,
         },
      ],
   },
   MonsterProjectile: {
      type: SpellType.Projectile,
      name: 'MonsterProjectile',
      range: 1000,
      spellPowerCost: 10,
      speed: 40,
      cooldown: 2000,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      description: 'Inflicts 20 Fire damage to an enemy and causes them to burn for 8 sec.',
      spellEffectsOnTarget: [
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
      spellPowerCost: 10,
      cooldown: 1000,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      description: 'Inflicts 15 Fire damage to an enemy and causes them to burn for 8 sec.',
      spellEffectsOnTarget: [
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
      spellPowerCost: 10,
      cooldown: 1000,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      description: 'Inflicts 40 Fire damage to an enemy and causes them to burn for 8 sec.',
      spellEffectsOnTarget: [
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
      spellPowerCost: 10,
      speed: 1000,
      cooldown: 0,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      description: 'Inflicts 100 damage to your target.',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Damage,
            amount: 100,
         },
      ],
   },

   DestroyerBasic: {
      type: SpellType.DirectInstant,
      name: 'DestroyerBasic',
      range: 40,
      spellPowerCost: 10,
      cooldown: 0,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      description: 'Inflicts 69 Fire damage to an enemy and causes them to burn for 8 sec.',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Damage,
            amount: 100,
         },
      ],
   },

   DestroyerPotatoFlyAttack: {
      type: SpellType.Channel,
      name: 'DestroyerPotatoFlyAttack',
      range: 4000,
      spellPowerCost: 0,
      cooldown: 0,
      channelFrequency: 2000,
      channelTime: 2000,
      channelSpells: [
         {
            name: 'DestroyerPotatoFlyAttack_DirectInstant',
            type: SpellType.DirectInstant,
            spellEffectsOnTarget: [
               {
                  type: SpellEffectType.Damage,
                  amount: 50,
               },
            ],
            spellEffectsOnDirectionLocation: [
               {
                  type: SpellEffectType.Area,
                  areaType: AreaType.Circle,
                  radius: 200,
                  period: 100000 * 10,
                  attackFrequency: 1000,
                  spellEffects: [
                     {
                        type: SpellEffectType.Damage,
                        amount: 50,
                     },
                  ],
               },
            ],
         },
      ],
   },

   DestroyerRoarAttack: {
      type: SpellType.Channel,
      name: 'DestroyerRoarAttack',
      range: 4000,
      spellPowerCost: 0,
      cooldown: 0,
      channelFrequency: 2000,
      channelTime: 2000,
      channelSpells: [
         {
            name: 'DestroyerRoarAttack_AngleBlast',
            type: SpellType.AngleBlast,
            angle: Math.PI * 2,
            range: 4000,
            spellEffectsOnTarget: [
               {
                  type: SpellEffectType.Damage,
                  amount: 100,
               },
            ],
         },
      ],
   },

   DestroyerBreatheAttack: {
      type: SpellType.Channel,
      name: 'DestroyerBreatheAttack',
      range: 4000,
      spellPowerCost: 0,
      cooldown: 0,
      channelFrequency: 200,
      channelTime: 2000,
      channelSpells: [
         {
            name: 'DestroyerBreatheAttack_AngleBlast',
            type: SpellType.AngleBlast,
            angle: Math.PI / 3,
            range: 1000,
            spellEffectsOnTarget: [
               {
                  type: SpellEffectType.Damage,
                  amount: 15,
               },
            ],
         },
      ],
   },
};
