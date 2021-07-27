import { forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { Engine } from '../../../engines/Engine';
import { PlayerCastSpellEvent } from '../../../types';
import { BossFightScheme, BossFightSpellItem, BossFightsTemplates, SpellAttackType } from '../BossFightsTemplates';
import { MonsterEngineEvents, ScheduleMonsterAttackEvent } from '../Events';
import { Monster } from '../types';

interface BossFightTrack {
   startTime: number;
   bossFightTemplate: BossFightScheme;
   castedSpells: Record<string, boolean>;
}

export class BossFightEngine extends Engine {
   activeBossFights: Record<string, BossFightTrack> = {};
   spellAttackTypeHandlers: Record<SpellAttackType, (bossId: string, templateItem: BossFightSpellItem) => void>;

   constructor() {
      super();
      this.spellAttackTypeHandlers = {
         [SpellAttackType.DirectRandomTarget]: this.directRandomTargetHandler,
         [SpellAttackType.BossTargetAttack]: this.bossTargetAttackHandler,
      };
   }

   pickPlayersForAction = (ids: string[], amount: number) => {
      const picked = [];
      let coppiedIds = [...ids];

      for (let i = 0; i < amount && coppiedIds.length > 0; i++) {
         const playerId = coppiedIds[Math.floor(Math.random() * coppiedIds.length)];
         picked.push(playerId);
         coppiedIds = coppiedIds.filter((id) => id !== playerId);
      }

      return picked;
   };

   directRandomTargetHandler = (bossId, templateItem) => {
      const aggro = this.services.aggroService.getMonsterAggro()[bossId];
      const pickedPlayers = this.pickPlayersForAction(Object.keys(aggro.allTargets), templateItem.targetAmount);

      forEach(pickedPlayers, (playerId) => {
         const player = this.services.characterService.getAllCharacters()[playerId];

         this.eventCrator.createEvent<PlayerCastSpellEvent>({
            type: EngineEvents.PlayerCastSpell,
            casterId: null,
            spell: templateItem.spell,
            directionLocation: player.location,
         });
      });
   };

   bossTargetAttackHandler = (bossId, templateItem) => {
      const aggro = this.services.aggroService.getMonsterAggro()[bossId];
      this.eventCrator.createEvent<ScheduleMonsterAttackEvent>({
         type: MonsterEngineEvents.ScheduleMonsterAttack,
         monsterId: bossId,
         targetId: aggro.currentTarget.characterId,
         spell: templateItem.spell,
      });
   };

   startNewBossFight = (monster: Monster) => {
      this.activeBossFights[monster.id] = {
         startTime: Date.now(),
         bossFightTemplate: BossFightsTemplates[monster.name],
         castedSpells: {},
      };
   };

   stopBossFight = (monsterId: string) => {
      delete this.activeBossFights[monsterId];
   };

   doAction() {
      forEach(this.activeBossFights, (bossFight, bossId) => {
         forEach(bossFight.bossFightTemplate, (templateItem, spellId) => {
            if (Date.now() - bossFight.startTime > templateItem.activationTime && !bossFight.castedSpells[spellId]) {
               bossFight.castedSpells[spellId] = true;

               this.spellAttackTypeHandlers[templateItem.type](bossId, templateItem);
            }
         });
      });
   }
}
