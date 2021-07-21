import { SpellEffectType, SpellType } from '../SpellType';

export interface Spell {
   type: SpellType;
   name: string;
   range: number;
   cooldown: number;
   spellEffects: AllEffects[];
   speed?: number;
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

type AllEffects = DamageEffect | HealEffect;
