import { AreaType, SpellEffectType, SpellType } from '../SpellType';

export interface Spell {
   type: SpellType;
   name: string;
   range: number;
   cooldown: number;
   image?: string;
   description?: string;
   spellEffectsOnTarget: AllEffects[];
   spellEffectsOnDirectionLocation: AllEffects[];
   spellEffectsOnCasterOnSpellHit: AllEffects[];
   spellPowerCost: number;

   angle?: number;

   speed?: number;

   areaType?: AreaType;
   radius?: number;

   channelSpells: Spell[];
   channelFrequency?: number;
   channelTime?: number;
}

export interface SpellEffect {
   type: SpellEffectType;
}

export interface DamageEffect extends SpellEffect {
   amount: number;
}

export interface HealEffect extends SpellEffect {
   amount: number;
}

export interface AreaEffect extends SpellEffect {
   areaType: AreaType;
   period: number;
   radius: number;
   attackFrequency: number;
   spellEffects: AllEffects[];
}

export interface GenerateSpellPowerEffect extends SpellEffect {
   amount: number;
}

type AllEffects = DamageEffect | HealEffect | AreaEffect | GenerateSpellPowerEffect;
