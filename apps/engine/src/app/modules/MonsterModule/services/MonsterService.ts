import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterLostHpEvent, EngineEventHandler, TakeCharacterHealthPointsEvent } from '../../../types';
import {
   MonsterEngineEvents,
   CreateNewMonsterEvent,
   NewMonsterCreatedEvent,
   MonsterTargetChangedEvent,
   MonsterLostTargetEvent,
   MonsterDiedEvent,
} from '../Events';
import { Monster } from '../types';

export class MonsterService extends EventParser {
   monsters: Record<string, Monster> = {};
   increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [MonsterEngineEvents.CreateNewMonster]: this.handleCreateNewMonster,
         [MonsterEngineEvents.MonsterTargetChanged]: this.test,
         [MonsterEngineEvents.MonsterLostTarget]: this.test2,
         [MonsterEngineEvents.MonsterDied]: this.handleMonsterDied,
         [EngineEvents.TakeCharacterHealthPoints]: this.handleTakeCharacterHealthPoints,
      };
   }

   test: EngineEventHandler<MonsterTargetChangedEvent> = ({ event }) => {
      console.log('targetChanged:', event.newTargetId);
   };
   test2: EngineEventHandler<MonsterLostTargetEvent> = ({ event }) => {
      console.log('targetLost:', event.targetId);
   };

   handleCreateNewMonster: EngineEventHandler<CreateNewMonsterEvent> = ({ event }) => {
      const id = `monster_${(this.increment++).toString()}`;
      this.monsters[id] = {
         id,
         name: event.monsterRespawn.monsterTemplate.name,
         location: event.monsterRespawn.location,
         sprites: event.monsterRespawn.monsterTemplate.sprites,
         size: event.monsterRespawn.monsterTemplate.size,
         direction: CharacterDirection.DOWN,
         division: event.monsterRespawn.monsterTemplate.division,
         isInMove: false,
         currentHp: event.monsterRespawn.monsterTemplate.healthPoints,
         maxHp: event.monsterRespawn.monsterTemplate.healthPoints,
         respawnId: event.monsterRespawn.id,
         sightRange: event.monsterRespawn.monsterTemplate.sightRange,
         escapeRange: event.monsterRespawn.monsterTemplate.escapeRange,
         spells: event.monsterRespawn.monsterTemplate.spells,
         attackFrequency: event.monsterRespawn.monsterTemplate.attackFrequency,
      };
      this.engineEventCrator.createEvent<NewMonsterCreatedEvent>({
         type: MonsterEngineEvents.NewMonsterCreated,
         monster: this.monsters[id],
      });
   };

   handleTakeCharacterHealthPoints: EngineEventHandler<TakeCharacterHealthPointsEvent> = ({ event }) => {
      if (this.monsters[event.characterId]) {
         this.monsters[event.characterId].currentHp = Math.max(this.monsters[event.characterId].currentHp - event.amount, 0);

         this.engineEventCrator.createEvent<CharacterLostHpEvent>({
            type: EngineEvents.CharacterLostHp,
            characterId: event.characterId,
            amount: event.amount,
            currentHp: this.monsters[event.characterId].currentHp,
         });

         if (this.monsters[event.characterId].currentHp === 0) {
            this.engineEventCrator.createEvent<MonsterDiedEvent>({
               type: MonsterEngineEvents.MonsterDied,
               monster: this.monsters[event.characterId],
               killerId: event.attackerId,
            });
         }
      }
   };

   handleMonsterDied: EngineEventHandler<MonsterDiedEvent> = ({ event }) => {
      delete this.monsters[event.monster.id];
   };

   getAllCharacters = () => this.monsters;
}
