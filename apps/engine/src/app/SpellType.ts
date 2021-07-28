export enum SpellType {
   Projectile = 'Projectile',
   GuidedProjectile = 'GuidedProjectile',
   DirectInstant = 'DirectInstant',
   AngleBlast = 'AngleBlast',
   Area = 'Area',
   Channel = 'Channel',
}

export enum AreaType {
   Circle = 'Circle',
}

export enum SpellEffectType {
   Damage = 'Damage',
   Heal = 'Heal',
   Area = 'Area',
   GenerateSpellPower = 'GenerateSpellPower',
   TickEffectOverTime = 'TickEffectOverTime',
   GainPowerStack = 'GetPowerStack',
   LosePowerStack = 'LosePowerStack',
}

export enum PowerStackType {
   HolyPower = 'HolyPower',
}

export const PowerStackLimit: Record<PowerStackType, number> = {
   [PowerStackType.HolyPower]: 3,
};
