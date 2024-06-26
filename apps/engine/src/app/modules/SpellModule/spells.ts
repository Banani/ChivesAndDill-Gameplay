import { Spell } from '@bananos/types';

export const ALL_SPELLS: Record<string, Spell> = {
    // Test: {
    //     type: SpellType.Projectile,
    //     name: 'Test',
    //     speed: 40,
    //     range: 600,
    //     cooldown: 0,
    //     spellPowerCost: 0,
    //     image: '../assets/spritesheets/spells/mage/fireball.jpg',
    //     description: '',
    //     spellEffectsOnTarget: [
    //         {
    //             type: SpellEffectType.Area,
    //             areaType: AreaType.Circle,
    //             spellId: "Test",
    //             period: 3000,
    //             attackFrequency: 500,
    //             name: 'Test_Area',
    //             radius: 100,
    //             spellEffects: [
    //                 {
    //                     type: SpellEffectType.Damage,
    //                     spellId: "Test",
    //                     amount: 15,
    //                 },
    //             ],
    //         },
    //         {
    //             type: SpellEffectType.TickEffectOverTime,
    //             spellId: 'Test_HOT_1',
    //             iconImage: '../assets/spritesheets/spells/mage/fireball.jpg',
    //             period: 10000,
    //             name: 'Ignite',
    //             description: 'Your target burns for an additional 6.0% over 9 sec of the total direct damage caused by your Fireball',
    //             timeEffectType: TimeEffectType.BUFF,
    //             activationFrequency: 1000,
    //             spellEffects: [{
    //                 spellId: "Test",
    //                 type: SpellEffectType.Heal,
    //                 amount: 20
    //             }],
    //         },
    //         {
    //             spellId: "Test",
    //             type: SpellEffectType.Damage,
    //             amount: 200,
    //         },
    //     ],
    // },
    // Fireball: {
    //     type: SpellType.Channel,
    //     name: 'Fireball',
    //     range: 600,
    //     spellPowerCost: 20,
    //     cooldown: 0,
    //     channelFrequency: 1500,
    //     channelTime: 3000,
    //     canByCastedInMovement: false,
    //     image: '../assets/spritesheets/spells/mage/fireball.jpg',
    //     channelSpells: [
    //         {
    //             type: SpellType.GuidedProjectile,
    //             name: 'FireBall_GuidedProjectile_1',
    //             speed: 40,
    //             spellEffectsOnTarget: [
    //                 {
    //                     spellId: "Fireball",
    //                     type: SpellEffectType.Damage,
    //                     amount: 10,
    //                 },
    //             ],
    //         },
    //     ],
    // },

    // PowerShield: {
    //     type: SpellType.Channel,
    //     name: 'PowerShield',
    //     range: 600,
    //     spellPowerCost: 60,
    //     cooldown: 5000,
    //     channelFrequency: 500,
    //     channelTime: 2500,
    //     canByCastedInMovement: false,
    //     image: '../assets/spritesheets/spells/mage/shield.jpg',
    //     channelSpells: [
    //         {
    //             type: SpellType.GuidedProjectile,
    //             name: 'PowerShield_GuidedProjectile_1',
    //             speed: 40,
    //             spellEffectsOnTarget: [
    //                 {
    //                     spellId: "PowerShield",
    //                     name: 'PowerShield',
    //                     type: SpellEffectType.AbsorbShield,
    //                     shieldValue: 100,
    //                     stack: 5,
    //                     id: 'PowerShield_GuidedProjectile_AbsorbShield_1',
    //                     period: 4000,
    //                     timeEffectType: TimeEffectType.BUFF,
    //                     iconImage: '../assets/spritesheets/spells/mage/shield.jpg',
    //                 },
    //             ],
    //         },
    //     ],
    // },

    // Teleportation: {
    //     type: SpellType.Teleportation,
    //     name: 'Teleportation',
    //     range: 1000,
    //     spellPowerCost: 10,
    //     cooldown: 4000,
    //     image: '../assets/spritesheets/spells/hunter/arcaneShot.jpg',
    // },

    // ArrowShot: {
    //     type: SpellType.Projectile,
    //     name: 'ArrowShot',
    //     speed: 40,
    //     range: 600,
    //     cooldown: 0,
    //     spellPowerCost: 0,
    //     image: '../assets/spritesheets/spells/hunter/arcaneShot.jpg',
    //     description: '',
    //     spellEffectsOnTarget: [
    //         {
    //             type: SpellEffectType.Damage,
    //             spellId: "ArrowShot",
    //             amount: 100,
    //         },
    //     ],
    // },
    // GuidedShot: {
    //     type: SpellType.Channel,
    //     name: 'GuidedShot',
    //     range: 600,
    //     spellPowerCost: 0,
    //     cooldown: 0,
    //     channelFrequency: 1500,
    //     channelTime: 1500,
    //     canByCastedInMovement: false,
    //     image: '../assets/spritesheets/spells/hunter/explosiveShot.jpg',
    //     channelSpells: [
    //         {
    //             type: SpellType.GuidedProjectile,
    //             name: 'GuidedShot_GuidedProjectile_1',
    //             speed: 40,
    //             spellEffectsOnTarget: [
    //                 {
    //                     type: SpellEffectType.Damage,
    //                     spellId: "GuidedShot",
    //                     amount: 80,
    //                 },
    //             ],
    //             spellEffectsOnCasterOnSpellHit: [
    //                 {
    //                     type: SpellEffectType.GenerateSpellPower,
    //                     spellId: "GuidedShot",
    //                     amount: 20,
    //                 },
    //             ],
    //         },
    //     ],
    // },
    // ToxicShot: {
    //     type: SpellType.GuidedProjectile,
    //     name: 'ToxicShot',
    //     range: 600,
    //     speed: 40,
    //     spellPowerCost: 20,
    //     cooldown: 800,
    //     image: '../assets/spritesheets/spells/hunter/serpentSting.jpg',
    //     spellEffectsOnTarget: [
    //         {
    //             type: SpellEffectType.TickEffectOverTime,
    //             spellId: 'GuidedShot_DOT_1',
    //             iconImage: '../assets/spritesheets/spells/hunter/serpentSting.jpg',
    //             period: 6000,
    //             name: 'Toxic Shot',
    //             description: 'Causes Nature damage every 1 second.',
    //             timeEffectType: TimeEffectType.DEBUFF,
    //             activationFrequency: 1000,
    //             spellEffects: [{
    //                 type: SpellEffectType.Damage,
    //                 spellId: "ToxicShot",
    //                 amount: 20
    //             }],
    //         },
    //     ],
    // },

    // HealingLight: {
    //     type: SpellType.Channel,
    //     name: 'HealingLight',
    //     range: 450,
    //     spellPowerCost: 40,
    //     cooldown: 0,
    //     channelFrequency: 1200,
    //     channelTime: 1200,
    //     canByCastedInMovement: false,
    //     image: '../assets/spritesheets/spells/paladin/healingLight.jpg',
    //     description: 'It heals your target',
    //     channelSpells: [
    //         {
    //             type: SpellType.DirectInstant,
    //             name: 'HealingLight_DirectInstant_1',
    //             spellEffectsOnTarget: [
    //                 {
    //                     spellId: "HealingLight",
    //                     type: SpellEffectType.Heal,
    //                     amount: 120,
    //                 },
    //             ],
    //         },
    //     ],
    // },
    // CrusaderStrike: {
    //     type: SpellType.DirectInstant,
    //     name: 'CrusaderStrike',
    //     range: 100,
    //     spellPowerCost: 0,
    //     cooldown: 800,
    //     image: '../assets/spritesheets/spells/paladin/crusaderStrike.jpg',
    //     description: 'Attack target and gain holy power stack',
    //     spellEffectsOnTarget: [
    //         {
    //             spellId: "CrusaderStrike",
    //             type: SpellEffectType.Damage,
    //             amount: 20,
    //         },
    //     ],
    //     spellEffectsOnCasterOnSpellHit: [
    //         {
    //             spellId: "CrusaderStrike",
    //             type: SpellEffectType.GainPowerStack,
    //             powerStackType: PowerStackType.HolyPower,
    //             amount: 1,
    //         },
    //     ],
    // },
    // HolyCone: {
    //     type: SpellType.AngleBlast,
    //     name: 'HolyCone',
    //     angle: Math.PI / 3,
    //     range: 250,
    //     spellPowerCost: 20,
    //     cooldown: 0,
    //     image: '../assets/spritesheets/spells/paladin/lightOfDawn.jpg',
    //     description: 'Spend your holy powers on area healing spell',
    //     spellEffectsOnTarget: [
    //         {
    //             spellId: "HolyCone",
    //             type: SpellEffectType.Heal,
    //             amount: 80,
    //         },
    //     ],
    //     requiredPowerStacks: [{ type: PowerStackType.HolyPower, amount: 3 }],
    // },
    // HolyCone2: {
    //     type: SpellType.AngleBlast,
    //     name: 'HolyCone2',
    //     angle: Math.PI / 9,
    //     range: 650,
    //     spellPowerCost: 20,
    //     cooldown: 0,
    //     image: '../assets/spritesheets/spells/paladin/lightOfDawn.jpg',
    //     description: 'Spend your holy powers on area healing spell',
    //     spellEffectsOnTarget: [
    //         {
    //             spellId: "HolyCone2",
    //             type: SpellEffectType.Damage,
    //             amount: 10,
    //         },
    //     ],
    //     //   requiredPowerStacks: [{ type: PowerStackType.HolyPower, amount: 3 }],
    // },
    // TauntingStrike: {
    //     type: SpellType.DirectInstant,
    //     name: 'TauntingStrike',
    //     range: 100,
    //     spellPowerCost: 0,
    //     cooldown: 800,
    //     image: '../assets/spritesheets/spells/warrior/shieldSlam.jpg',
    //     description: 'A strike that force your target to attack you',
    //     spellEffectsOnCasterOnSpellHit: [{ spellId: "TauntingStrike", type: SpellEffectType.GenerateSpellPower, amount: 13 }],
    //     spellEffectsOnTarget: [{ spellId: "TauntingStrike", type: SpellEffectType.Damage, amount: 40 }],
    // },
    // HealingStrike: {
    //     type: SpellType.DirectInstant,
    //     name: 'HealingStrike',
    //     range: 100,
    //     spellPowerCost: 20,
    //     cooldown: 1000,
    //     image: '../assets/spritesheets/spells/warrior/bloodThirst.jpg',
    //     description: 'It deals damage, but also heals you',
    //     spellEffectsOnCasterOnSpellHit: [{ spellId: "HealingStrike", type: SpellEffectType.Heal, amount: 40 }],
    //     spellEffectsOnTarget: [{ spellId: "HealingStrike", type: SpellEffectType.Damage, amount: 25 }],
    // },
    // BleedingStrike: {
    //     type: SpellType.DirectInstant,
    //     name: 'BleedingStrike',
    //     range: 100,
    //     spellPowerCost: 10,
    //     cooldown: 2000,
    //     image: '../assets/spritesheets/spells/warrior/rend.jpg',
    //     description: 'Inflicts Physical damage to an enemy every 3 sec. for 15 sec.',
    //     spellEffectsOnTarget: [
    //         {
    //             type: SpellEffectType.TickEffectOverTime,
    //             name: 'Rend',
    //             description: 'Physical damage inflicted every 1 sec.',
    //             timeEffectType: TimeEffectType.DEBUFF,
    //             spellId: 'BleedingStrike_DOT_1',
    //             iconImage: '../assets/spritesheets/spells/warrior/rend.jpg',
    //             period: 15000,
    //             activationFrequency: 3000,
    //             spellEffects: [{ spellId: "BleedingStrike", type: SpellEffectType.Damage, amount: 12 }],
    //         },
    //     ],
    // },

    // MonsterProjectile: {
    //     type: SpellType.GuidedProjectile,
    //     name: 'MonsterProjectile',
    //     range: 1000,
    //     spellPowerCost: 10,
    //     speed: 40,
    //     cooldown: 200,
    //     image: '../assets/spritesheets/spells/mage/fireball.jpg',
    //     description: 'Inflicts 20 Fire damage to an enemy and causes them to burn for 8 sec.',
    //     spellEffectsOnTarget: [
    //         {
    //             spellId: "MonsterProjectile",
    //             type: SpellEffectType.Damage,
    //             amount: 10,
    //         },
    //     ],
    // },
    // MonsterInstant1: {
    //     type: SpellType.DirectInstant,
    //     name: 'MonsterInstant1',
    //     range: 500,
    //     spellPowerCost: 10,
    //     cooldown: 1000,
    //     image: '../assets/spritesheets/spells/mage/ignite.jpg',
    //     description: 'Inflicts 15 Fire damage to an enemy and causes them to burn for 8 sec.',
    //     spellEffectsOnTarget: [
    //         {
    //             spellId: "MonsterInstant1",
    //             type: SpellEffectType.Damage,
    //             amount: 2,
    //         },
    //     ],
    // },
    // MonsterInstant2: {
    //     type: SpellType.DirectInstant,
    //     name: 'MonsterInstant2',
    //     range: 1500,
    //     spellPowerCost: 10,
    //     cooldown: 1000,
    //     image: '../assets/spritesheets/spells/mage/fireball.jpg',
    //     description: 'Inflicts 40 Fire damage to an enemy and causes them to burn for 8 sec.',
    //     spellEffectsOnTarget: [
    //         {
    //             spellId: "MonsterInstant2",
    //             type: SpellEffectType.Damage,
    //             amount: 5,
    //         },
    //     ],
    // },

    // DestroyerBasic: {
    //     type: SpellType.DirectInstant,
    //     name: 'DestroyerBasic',
    //     range: 100,
    //     spellPowerCost: 10,
    //     cooldown: 0,
    //     image: '../assets/spritesheets/spells/mage/fireball.jpg',
    //     description: 'Inflicts 69 Fire damage to an enemy and causes them to burn for 8 sec.',
    //     spellEffectsOnTarget: [
    //         {
    //             spellId: "DestroyerBasic",
    //             type: SpellEffectType.Damage,
    //             amount: 100,
    //         },
    //     ],
    // },

    // DestroyerPotatoFlyAttack: {
    //     type: SpellType.Channel,
    //     name: 'DestroyerPotatoFlyAttack',
    //     range: 4000,
    //     spellPowerCost: 0,
    //     cooldown: 0,
    //     channelFrequency: 2000,
    //     channelTime: 2000,
    //     canByCastedInMovement: false,
    //     channelSpells: [
    //         {
    //             name: 'DestroyerPotatoFlyAttack_DirectInstant',
    //             type: SpellType.DirectInstant,
    //             spellEffectsOnTarget: [
    //                 {
    //                     spellId: "DestroyerPotatoFlyAttack",
    //                     type: SpellEffectType.Damage,
    //                     amount: 50,
    //                 },
    //             ],
    //             spellEffectsOnDirectionLocation: [
    //                 {
    //                     type: SpellEffectType.Area,
    //                     spellId: "DestroyerPotatoFlyAttack",
    //                     name: 'DestroyerPotatoFlyAttack_DirectInstant_Area',
    //                     areaType: AreaType.Circle,
    //                     radius: 120,
    //                     period: 100000 * 10,
    //                     attackFrequency: 1000,
    //                     spellEffects: [
    //                         {
    //                             spellId: "DestroyerPotatoFlyAttack",
    //                             type: SpellEffectType.Damage,
    //                             amount: 50,
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //     ],
    // },

    // DestroyerRoarAttack: {
    //     type: SpellType.Channel,
    //     name: 'DestroyerRoarAttack',
    //     range: 800,
    //     spellPowerCost: 0,
    //     cooldown: 0,
    //     channelFrequency: 2000,
    //     channelTime: 2000,
    //     canByCastedInMovement: false,
    //     channelSpells: [
    //         {
    //             name: 'DestroyerRoarAttack_AngleBlast',
    //             type: SpellType.AngleBlast,
    //             angle: Math.PI * 2,
    //             range: 800,
    //             spellEffectsOnTarget: [
    //                 {
    //                     spellId: "DestroyerRoarAttack",
    //                     type: SpellEffectType.Damage,
    //                     amount: 150,
    //                 },
    //                 {
    //                     type: SpellEffectType.Area,
    //                     spellId: "DestroyerRoarAttack",
    //                     name: 'DestroyerRoarAttack_AngleBlast_Area',
    //                     areaType: AreaType.Circle,
    //                     radius: 120,
    //                     period: 100000 * 10,
    //                     attackFrequency: 1000,
    //                     spellEffects: [
    //                         {
    //                             spellId: "DestroyerRoarAttack",
    //                             type: SpellEffectType.Damage,
    //                             amount: 50,
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //     ],
    // },

    // DestroyerBreatheAttack: {
    //     type: SpellType.Channel,
    //     name: 'DestroyerBreatheAttack',
    //     range: 600,
    //     spellPowerCost: 0,
    //     cooldown: 0,
    //     channelFrequency: 200,
    //     channelTime: 2000,
    //     canByCastedInMovement: false,
    //     channelSpells: [
    //         {
    //             name: 'DestroyerBreatheAttack_AngleBlast',
    //             type: SpellType.AngleBlast,
    //             angle: Math.PI / 4,
    //             range: 600,
    //             spellEffectsOnTarget: [
    //                 {
    //                     spellId: "DestroyerBreatheAttack",
    //                     type: SpellEffectType.Damage,
    //                     amount: 35,
    //                 },
    //             ],
    //         },
    //     ],
    // },
};
