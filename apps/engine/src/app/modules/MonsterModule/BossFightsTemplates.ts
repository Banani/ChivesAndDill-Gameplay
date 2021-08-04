import { ALL_SPELLS } from '../SpellModule/spells';
import type { Spell } from '../SpellModule/types/spellTypes';

export enum SpellAttackType {
   DirectRandomTarget = 'DirectRandomTarget',
   BossTargetAttack = 'BossTargetAttack',
}

export interface BossFightSpellItem {
   type: SpellAttackType;
   targetAmount?: number;
   activationTime: number;
   spell: Spell;
}

export type BossFightScheme = BossFightSpellItem[];

export const BossFightsTemplates: Record<string, BossFightScheme> = {
   WorldDestroyer: [
      {
         type: SpellAttackType.BossTargetAttack,
         activationTime: 5000,
         spell: ALL_SPELLS['DestroyerBreatheAttack'],
      },
      {
         type: SpellAttackType.DirectRandomTarget,
         targetAmount: 2,
         activationTime: 10000,
         spell: ALL_SPELLS['DestroyerPotatoFlyAttack'],
      },
      {
         type: SpellAttackType.BossTargetAttack,
         activationTime: 15000,
         spell: ALL_SPELLS['DestroyerRoarAttack'],
      },
      {
         type: SpellAttackType.BossTargetAttack,
         activationTime: 20000,
         spell: ALL_SPELLS['DestroyerBreatheAttack'],
      },
      {
         type: SpellAttackType.DirectRandomTarget,
         targetAmount: 2,
         activationTime: 25000,
         spell: ALL_SPELLS['DestroyerPotatoFlyAttack'],
      },
      {
         type: SpellAttackType.BossTargetAttack,
         activationTime: 30000,
         spell: ALL_SPELLS['DestroyerRoarAttack'],
      },
   ],
};
