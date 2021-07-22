import { AreaType, SpellEffectType, SpellType } from '../SpellType';

export interface Spell {
   type: SpellType;
   name: string;
   range: number;
   cooldown: number;
   spellEffectsOnTarget: AllEffects[];
   spellEffectsOnDirectionLocation: AllEffects[];

   angle?: number;

   speed?: number;

   areaType?: AreaType;
   radius?: number;
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

type AllEffects = DamageEffect | HealEffect | AreaEffect;
