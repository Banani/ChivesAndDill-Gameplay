import { TimeEffectType } from '@bananos/types';
import { Classes } from '../../types/Classes';
import type { Spell } from './types/spellTypes';
import { AreaType, PowerStackType, SpellEffectType, SpellType } from './types/spellTypes';

export const ALL_SPELLS: Record<string, Spell> = {
   Test: {
      type: SpellType.Projectile,
      name: 'Test',
      speed: 40,
      range: 600,
      cooldown: 0,
      spellPowerCost: 0,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      description: '',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Area,
            areaType: AreaType.Circle,
            period: 3000,
            attackFrequency: 500,
            name: 'Test_Area',
            radius: 100,
            spellEffects: [
               {
                  type: SpellEffectType.Damage,
                  amount: 15,
               },
            ],
         },
         {
            type: SpellEffectType.TickEffectOverTime,
            spellId: 'Test_HOT_1',
            iconImage: 'peepeepoopoo_tutajprzyjdzieizmieni',
            period: 10000,
            name: 'Masarzyk kumpa',
            description: 'pszyiacielski masarzyk ukaiajoncy nerwy',
            timeEffectType: TimeEffectType.BUFF,
            activationFrequency: 1000,
            spellEffects: [{ type: SpellEffectType.Heal, amount: 20 }],
         },
      ],
   },
   Fireball: {
      type: SpellType.Channel,
      name: 'Fireball',
      range: 600,
      spellPowerCost: 20,
      cooldown: 0,
      channelFrequency: 1500,
      channelTime: 1500,
      canByCastedInMovement: false,
      image: '../assets/spritesheets/spells/mage/fireball.jpg',
      channelSpells: [
         {
            type: SpellType.GuidedProjectile,
            name: 'FireBall_GuidedProjectile_1',
            speed: 40,
            spellEffectsOnTarget: [
               {
                  type: SpellEffectType.Damage,
                  amount: 200,
               },
            ],
         },
      ],
   },

   PowerShield: {
      type: SpellType.Channel,
      name: 'PowerShield',
      range: 600,
      spellPowerCost: 60,
      cooldown: 8000,
      channelFrequency: 400,
      channelTime: 2500,
      canByCastedInMovement: false,
      image: '../assets/spritesheets/spells/mage/shield.jpg',
      channelSpells: [
         {
            type: SpellType.GuidedProjectile,
            name: 'PowerShield_GuidedProjectile_1',
            speed: 40,
            spellEffectsOnTarget: [
               {
                  type: SpellEffectType.AbsorbShield,
                  shieldValue: 50,
                  stack: 5,
                  id: 'PowerShield_GuidedProjectile_AbsorbShield_1',
                  period: 4000,
               },
            ],
         },
      ],
   },

   Teleportation: {
      type: SpellType.Teleportation,
      name: 'Teleportation',
      range: 1000,
      spellPowerCost: 10,
      cooldown: 10000,
      image: '../assets/spritesheets/spells/hunter/arcaneShot.jpg',
   },

   ArrowShot: {
      type: SpellType.Projectile,
      name: 'ArrowShot',
      speed: 40,
      range: 600,
      cooldown: 800,
      spellPowerCost: 40,
      image: '../assets/spritesheets/spells/hunter/arcaneShot.jpg',
      description: '',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Damage,
            amount: 100,
         },
      ],
   },
   GuidedShot: {
      type: SpellType.Channel,
      name: 'GuidedShot',
      range: 600,
      spellPowerCost: 0,
      cooldown: 0,
      channelFrequency: 1500,
      channelTime: 1500,
      canByCastedInMovement: false,
      image: '../assets/spritesheets/spells/hunter/explosiveShot.jpg',
      channelSpells: [
         {
            type: SpellType.GuidedProjectile,
            name: 'GuidedShot_GuidedProjectile_1',
            speed: 40,
            spellEffectsOnTarget: [
               {
                  type: SpellEffectType.Damage,
                  amount: 80,
               },
            ],
            spellEffectsOnCasterOnSpellHit: [
               {
                  type: SpellEffectType.GenerateSpellPower,
                  amount: 20,
               },
            ],
         },
      ],
   },
   ToxicShot: {
      type: SpellType.GuidedProjectile,
      name: 'ToxicShot',
      range: 600,
      speed: 40,
      spellPowerCost: 20,
      cooldown: 800,
      image: '../assets/spritesheets/spells/hunter/serpentSting.jpg',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.TickEffectOverTime,
            spellId: 'GuidedShot_DOT_1',
            iconImage: 'peepeepoopoo_tutajprzyjdzieizmieni',
            period: 6000,
            name: 'ToxicShot_TickEffectOverTime',
            description: 'Potworne menki od zatrocia',
            timeEffectType: TimeEffectType.DEBUFF,
            activationFrequency: 1000,
            spellEffects: [{ type: SpellEffectType.Damage, amount: 20 }],
         },
      ],
   },

   HealingLight: {
      type: SpellType.Channel,
      name: 'HealingLight',
      range: 450,
      spellPowerCost: 40,
      cooldown: 0,
      channelFrequency: 1200,
      channelTime: 1200,
      canByCastedInMovement: false,
      image: '../assets/spritesheets/spells/paladin/healingLight.jpg',
      description: 'It heals your target',
      channelSpells: [
         {
            type: SpellType.DirectInstant,
            name: 'HealingLight_DirectInstant_1',
            spellEffectsOnTarget: [
               {
                  type: SpellEffectType.Heal,
                  amount: 120,
               },
            ],
         },
      ],
   },
   CrusaderStrike: {
      type: SpellType.DirectInstant,
      name: 'CrusaderStrike',
      range: 100,
      spellPowerCost: 0,
      cooldown: 800,
      image: '../assets/spritesheets/spells/paladin/crusaderStrike.jpg',
      description: 'Attack target and gain holy power stack',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Damage,
            amount: 20,
         },
      ],
      spellEffectsOnCasterOnSpellHit: [
         {
            type: SpellEffectType.GainPowerStack,
            powerStackType: PowerStackType.HolyPower,
            amount: 1,
         },
      ],
   },
   HolyCone: {
      type: SpellType.AngleBlast,
      name: 'HolyCone',
      angle: Math.PI / 3,
      range: 250,
      spellPowerCost: 20,
      cooldown: 0,
      image: '../assets/spritesheets/spells/paladin/lightOfDawn.jpg',
      description: 'Spend your holy powers on area healing spell',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Heal,
            amount: 80,
         },
      ],
      //   requiredPowerStacks: [{ type: PowerStackType.HolyPower, amount: 3 }],
   },
   HolyCone2: {
      type: SpellType.AngleBlast,
      name: 'HolyCone2',
      angle: Math.PI / 9,
      range: 350,
      spellPowerCost: 20,
      cooldown: 0,
      image: '../assets/spritesheets/spells/paladin/lightOfDawn.jpg',
      description: 'Spend your holy powers on area healing spell',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.Damage,
            amount: 90,
         },
      ],
      //   requiredPowerStacks: [{ type: PowerStackType.HolyPower, amount: 3 }],
   },
   TauntingStrike: {
      type: SpellType.DirectInstant,
      name: 'TauntingStrike',
      range: 100,
      spellPowerCost: 0,
      cooldown: 800,
      image: '../assets/spritesheets/spells/warrior/shieldSlam.jpg',
      description: 'A strike that force your target to attack you',
      spellEffectsOnCasterOnSpellHit: [{ type: SpellEffectType.GenerateSpellPower, amount: 13 }],
      spellEffectsOnTarget: [{ type: SpellEffectType.Damage, amount: 40 }],
   },
   HealingStrike: {
      type: SpellType.DirectInstant,
      name: 'HealingStrike',
      range: 100,
      spellPowerCost: 20,
      cooldown: 1000,
      image: '../assets/spritesheets/spells/warrior/bloodThirst.jpg',
      description: 'It deals damage, but also heals you',
      spellEffectsOnCasterOnSpellHit: [{ type: SpellEffectType.Heal, amount: 40 }],
      spellEffectsOnTarget: [{ type: SpellEffectType.Damage, amount: 25 }],
   },
   BleedingStrike: {
      type: SpellType.DirectInstant,
      name: 'BleedingStrike',
      range: 100,
      spellPowerCost: 10,
      cooldown: 1000,
      image: '../assets/spritesheets/spells/warrior/rend.jpg',
      description: 'It opens tager wounds, and make him bleed',
      spellEffectsOnTarget: [
         {
            type: SpellEffectType.TickEffectOverTime,
            name: 'PEEEPEEEPOO_NATOR',
            description: 'Robie pee pee, atakowanemu',
            timeEffectType: TimeEffectType.DEBUFF,
            spellId: 'BleedingStrike_DOT_1',
            iconImage: 'peepeepoopoo_tutajprzyjdzieizmieni',
            period: 6000,
            activationFrequency: 1000,
            spellEffects: [{ type: SpellEffectType.Damage, amount: 12 }],
         },
      ],
   },

   MonsterProjectile: {
      type: SpellType.GuidedProjectile,
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

   DestroyerBasic: {
      type: SpellType.DirectInstant,
      name: 'DestroyerBasic',
      range: 100,
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
      canByCastedInMovement: false,
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
                  name: 'DestroyerPotatoFlyAttack_DirectInstant_Area',
                  areaType: AreaType.Circle,
                  radius: 120,
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
      range: 800,
      spellPowerCost: 0,
      cooldown: 0,
      channelFrequency: 2000,
      channelTime: 2000,
      canByCastedInMovement: false,
      channelSpells: [
         {
            name: 'DestroyerRoarAttack_AngleBlast',
            type: SpellType.AngleBlast,
            angle: Math.PI * 2,
            range: 800,
            spellEffectsOnTarget: [
               {
                  type: SpellEffectType.Damage,
                  amount: 150,
               },
               {
                  type: SpellEffectType.Area,
                  name: 'DestroyerRoarAttack_AngleBlast_Area',
                  areaType: AreaType.Circle,
                  radius: 120,
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

   DestroyerBreatheAttack: {
      type: SpellType.Channel,
      name: 'DestroyerBreatheAttack',
      range: 600,
      spellPowerCost: 0,
      cooldown: 0,
      channelFrequency: 200,
      channelTime: 2000,
      canByCastedInMovement: false,
      channelSpells: [
         {
            name: 'DestroyerBreatheAttack_AngleBlast',
            type: SpellType.AngleBlast,
            angle: Math.PI / 4,
            range: 600,
            spellEffectsOnTarget: [
               {
                  type: SpellEffectType.Damage,
                  amount: 35,
               },
            ],
         },
      ],
   },
};

export const SpellsPerClass: Record<Classes, Record<string, Spell>> = {
   [Classes.Tank]: {
      Test: ALL_SPELLS['Test'],
      BleedingStrike: ALL_SPELLS['BleedingStrike'],
      TauntingStrike: ALL_SPELLS['TauntingStrike'],
      HealingStrike: ALL_SPELLS['HealingStrike'],
   },

   [Classes.Healer]: {
      HealingLight: ALL_SPELLS['HealingLight'],
      HolyCone: ALL_SPELLS['HolyCone'],
      HolyCone2: ALL_SPELLS['HolyCone2'],
      CrusaderStrike: ALL_SPELLS['CrusaderStrike'],
   },

   [Classes.Hunter]: { ArrowShot: ALL_SPELLS['ArrowShot'], toxicShot: ALL_SPELLS['toxicShot'], GuidedShot: ALL_SPELLS['GuidedShot'] },

   [Classes.Mage]: { Fireball: ALL_SPELLS['Fireball'], PowerShield: ALL_SPELLS['PowerShield'], Teleportation: ALL_SPELLS['Teleportation'] },
};
