import { forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { CharacterDiedEvent, EngineEventHandler, PlayerMovedEvent } from '../../../types';
import { Services } from '../../../types/Services';
import { CharacterEngineEvents, CharacterRemovedEvent } from '../../CharacterModule/Events';
import { ApplyTargetSpellEffectEvent, SpellEngineEvents } from '../../SpellModule/Events';
import { SpellEffectType, DamageEffect } from '../../SpellModule/types/SpellTypes';
import { MonsterDiedEvent, MonsterEngineEvents, MonsterLostAggroEvent, MonsterLostTargetEvent, MonsterPulledEvent, MonsterTargetChangedEvent } from '../Events';
import { MonsterRespawns } from '../MonsterRespawns';
import { Monster } from '../types';

interface Aggro {
   currentTarget: AggroTarget;
   allTargets: Record<string, AggroTarget>;
}

interface AggroTarget {
   characterId: string;
   level: number;
}

export class AggroService extends EventParser {
   monsterAggro: Record<string, Aggro> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [MonsterEngineEvents.MonsterTargetChanged]: this.handleMonsterTargetChanged,
         [CharacterEngineEvents.CharacterRemoved]: this.handleCharacterRemoved,

         [SpellEngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
      };
   }

   addInitialAgrro = (monster: Monster, characterId: string) => {
      const newAggro = { characterId: characterId, level: 0.1 };
      this.monsterAggro[monster.id] = { currentTarget: newAggro, allTargets: { [characterId]: newAggro } };

      this.engineEventCrator.asyncCeateEvent<MonsterPulledEvent>({
         type: MonsterEngineEvents.MonsterPulled,
         targetId: characterId,
         monster,
      });

      this.engineEventCrator.asyncCeateEvent<MonsterTargetChangedEvent>({
         type: MonsterEngineEvents.MonsterTargetChanged,
         newTargetId: characterId,
         monster,
      });
   };

   deleteAggro = (monsterId: string, targetId: string) => {
      delete this.monsterAggro[monsterId].allTargets[targetId];
      this.engineEventCrator.asyncCeateEvent<MonsterLostTargetEvent>({
         type: MonsterEngineEvents.MonsterLostTarget,
         targetId: targetId,
         monsterId: monsterId,
      });

      if (Object.keys(this.monsterAggro[monsterId].allTargets).length === 0) {
         delete this.monsterAggro[monsterId];
         this.engineEventCrator.asyncCeateEvent<MonsterLostAggroEvent>({
            type: MonsterEngineEvents.MonsterLostAggro,
            monsterId,
         });
      } else {
         this.monsterAggro[monsterId].currentTarget = { level: 0, characterId: '0' };
         forEach(this.monsterAggro[monsterId].allTargets, (target) => {
            if (this.monsterAggro[monsterId].currentTarget.level < target.level) {
               this.monsterAggro[monsterId].currentTarget = target;
            }
         });
      }
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event, services }) => {
      if (services.monsterService.getAllCharacters()[event.characterId]) {
         return;
      }

      forEach(services.monsterService.getAllCharacters(), (monster) => {
         if (distanceBetweenTwoPoints(monster.location, event.newLocation) <= monster.sightRange && !this.monsterAggro[monster.id]) {
            this.addInitialAgrro(monster, event.characterId);
         }
      });

      forEach(this.monsterAggro, (monsterAggro, monsterId) => {
         const monster = services.monsterService.getAllCharacters()[monsterId];

         // BUG
         if (!monster) {
            return;
         }

         if (
            monsterAggro.allTargets[event.characterId] &&
            distanceBetweenTwoPoints(MonsterRespawns[monster.respawnId].location, event.newLocation) > monster.escapeRange
         ) {
            this.deleteAggro(monsterId, event.characterId);
         }
      });
   };

   wasItDmgFromTheMonster = ({ event, services }: { event: ApplyTargetSpellEffectEvent; services: Services }) =>
      services.monsterService.getAllCharacters()[event.caster.id];

   wasItDmgToThePlayer = ({ event, services }: { event: ApplyTargetSpellEffectEvent; services: Services }) =>
      services.characterService.getAllCharacters()[event.target.id];

   handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event, services }) => {
      if (event.effect.type !== SpellEffectType.Damage) {
         return;
      }

      if (!event.caster || this.wasItDmgToThePlayer({ event, services })) {
         return;
      }

      if (this.wasItDmgFromTheMonster({ event, services })) {
         return;
      }

      let aggro = this.monsterAggro[event.target.id];
      if (!aggro) {
         this.monsterAggro[event.target.id] = {
            currentTarget: {
               level: 0,
               characterId: event.caster.id,
            },
            allTargets: {},
         };
         aggro = this.monsterAggro[event.target.id];
      }

      const monsterAggros = aggro.allTargets;
      if (!monsterAggros[event.caster.id]) {
         monsterAggros[event.caster.id] = {
            level: 0,
            characterId: event.caster.id,
         };

         this.engineEventCrator.asyncCeateEvent<MonsterPulledEvent>({
            type: MonsterEngineEvents.MonsterPulled,
            monster: event.target as Monster,
            targetId: event.target.id,
         });
      }

      const damageEffect = event.effect as DamageEffect;
      monsterAggros[event.caster.id].level += damageEffect.amount;

      if (monsterAggros[event.caster.id].level > aggro.currentTarget.level * 2) {
         aggro.currentTarget = monsterAggros[event.caster.id];

         this.engineEventCrator.asyncCeateEvent<MonsterTargetChangedEvent>({
            type: MonsterEngineEvents.MonsterTargetChanged,
            newTargetId: event.caster.id,
            monster: event.target as Monster,
         });
      }
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      if (this.monsterAggro[event.characterId]) {
         delete this.monsterAggro[event.characterId];
      } else {
         forEach(this.monsterAggro, (aggro, monsterId) => {
            if (aggro.allTargets[event.characterId]) {
               this.deleteAggro(monsterId, event.characterId);
            }
         });
      }
   };

   handleMonsterTargetChanged: EngineEventHandler<MonsterTargetChangedEvent> = ({ event, services }) => {
      forEach(services.monsterService.getAllCharacters(), (monster) => {
         if (!this.monsterAggro[monster.id] && distanceBetweenTwoPoints(monster.location, event.monster.location) < monster.sightRange) {
            this.addInitialAgrro(monster, event.newTargetId);
         }
      });
   };

   getMonsterAggro = () => this.monsterAggro;

   handleCharacterRemoved: EngineEventHandler<CharacterRemovedEvent> = ({ event }) => {
      forEach(this.monsterAggro, (aggro, monsterId) => {
         if (aggro.allTargets[event.character.id]) {
            this.deleteAggro(monsterId, event.character.id);
         }
      });
   };
}
