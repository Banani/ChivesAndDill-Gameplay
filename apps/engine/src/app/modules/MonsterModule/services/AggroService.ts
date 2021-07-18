import { forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { CharacterDiedEvent, CharacterHitEvent, EngineEventHandler, PlayerDisconnectedEvent, PlayerMovedEvent } from '../../../types';
import { Services } from '../../../types/Services';
import { MonsterDiedEvent, MonsterEngineEvents, MonsterLostTargetEvent, MonsterTargetChangedEvent } from '../Events';
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
         [EngineEvents.CharacterHit]: this.handleCharacterHit,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [MonsterEngineEvents.MonsterDied]: this.handleMonsterDied,
         [MonsterEngineEvents.MonsterTargetChanged]: this.handleMonsterTargetChanged,
         [EngineEvents.PlayerDisconnected]: this.handlePlayerDisconnected,
      };
   }

   addInitialAgrro = (monster: Monster, characterId: string) => {
      const newAggro = { characterId: characterId, level: 0.1 };
      this.monsterAggro[monster.id] = { currentTarget: newAggro, allTargets: { [characterId]: newAggro } };

      this.engineEventCrator.createEvent<MonsterTargetChangedEvent>({
         type: MonsterEngineEvents.MonsterTargetChanged,
         newTargetId: characterId,
         monster,
      });
   };

   deleteAggro = (monsterId: string, targetId: string) => {
      delete this.monsterAggro[monsterId].allTargets[targetId];
      if (Object.keys(this.monsterAggro[monsterId].allTargets).length === 0) {
         delete this.monsterAggro[monsterId];
      } else {
         this.monsterAggro[monsterId].currentTarget = { level: 0, characterId: '0' };
         forEach(this.monsterAggro[monsterId].allTargets, (target) => {
            if (this.monsterAggro[monsterId].currentTarget.level < target.level) {
               this.monsterAggro[monsterId].currentTarget = target;
            }
         });
      }

      this.engineEventCrator.createEvent<MonsterLostTargetEvent>({
         type: MonsterEngineEvents.MonsterLostTarget,
         targetId: targetId,
         monsterId: monsterId,
      });
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event, services }) => {
      forEach(services.monsterService.getAllCharacters(), (monster) => {
         if (distanceBetweenTwoPoints(monster.location, event.newLocation) <= monster.sightRange && !this.monsterAggro[monster.id]) {
            this.addInitialAgrro(monster, event.characterId);
         }
      });

      forEach(this.monsterAggro, (monsterAggro, monsterId) => {
         const monster = services.monsterService.getAllCharacters()[monsterId];
         if (monsterAggro.allTargets[event.characterId] && distanceBetweenTwoPoints(monster.location, event.newLocation) > monster.escapeRange) {
            this.deleteAggro(monsterId, event.characterId);
         }
      });
   };

   wasItDmgFromTheMonster = ({ event, services }: { event: CharacterHitEvent; services: Services }) =>
      services.monsterService.getAllCharacters()[event.attackerId];

   wasItDmgToThePlayer = ({ event, services }: { event: CharacterHitEvent; services: Services }) =>
      services.characterService.getAllCharacters()[event.target.id];

   handleCharacterHit: EngineEventHandler<CharacterHitEvent> = ({ event, services }) => {
      if (this.wasItDmgToThePlayer({ event, services })) {
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
               characterId: event.attackerId,
            },
            allTargets: {},
         };
         aggro = this.monsterAggro[event.target.id];
      }

      const monsterAggros = aggro.allTargets;
      if (!monsterAggros[event.attackerId]) {
         monsterAggros[event.attackerId] = {
            level: 0,
            characterId: event.attackerId,
         };
      }
      monsterAggros[event.attackerId].level += event.spell.damage;

      if (monsterAggros[event.attackerId].level > aggro.currentTarget.level * 2) {
         aggro.currentTarget = monsterAggros[event.attackerId];

         this.engineEventCrator.createEvent<MonsterTargetChangedEvent>({
            type: MonsterEngineEvents.MonsterTargetChanged,
            newTargetId: event.attackerId,
            monster: event.target as Monster,
         });
      }
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      forEach(this.monsterAggro, (aggro, monsterId) => {
         if (aggro.allTargets[event.character.id]) {
            this.deleteAggro(monsterId, event.character.id);
         }
      });
   };

   handleMonsterDied: EngineEventHandler<MonsterDiedEvent> = ({ event }) => {
      delete this.monsterAggro[event.monster.id];
   };

   handleMonsterTargetChanged: EngineEventHandler<MonsterTargetChangedEvent> = ({ event, services }) => {
      forEach(services.monsterService.getAllCharacters(), (monster) => {
         if (!this.monsterAggro[monster.id] && distanceBetweenTwoPoints(monster.location, event.monster.location) < monster.sightRange) {
            this.addInitialAgrro(monster, event.newTargetId);
         }
      });
   };

   getMonsterAggro = () => this.monsterAggro;

   handlePlayerDisconnected: EngineEventHandler<PlayerDisconnectedEvent> = ({ event }) => {
      forEach(this.monsterAggro, (aggro, monsterId) => {
         if (aggro.allTargets[event.payload.playerId]) {
            this.deleteAggro(monsterId, event.payload.playerId);
         }
      });
   };
}
