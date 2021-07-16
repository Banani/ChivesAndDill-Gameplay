import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, CharacterHitEvent, CharacterLostHpEvent, EngineEventHandler } from '../../../types';
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
         [EngineEvents.CharacterHit]: this.handleCharacterHit,
         [MonsterEngineEvents.CreateNewMonster]: this.handleCreateNewMonster,
         [MonsterEngineEvents.MonsterTargetChanged]: this.test,
         [MonsterEngineEvents.MonsterLostTarget]: this.test2,
         [MonsterEngineEvents.MonsterDied]: this.handleMonsterDied,
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

   handleCharacterHit: EngineEventHandler<CharacterHitEvent> = ({ event }) => {
      if (this.monsters[event.target.id]) {
         this.monsters[event.target.id].currentHp = Math.max(this.monsters[event.target.id].currentHp - event.spell.damage, 0);

         this.engineEventCrator.createEvent<CharacterLostHpEvent>({
            type: EngineEvents.CharacterLostHp,
            characterId: event.target.id,
            amount: event.spell.damage,
            currentHp: this.monsters[event.target.id].currentHp,
         });

         if (this.monsters[event.target.id].currentHp === 0) {
            this.engineEventCrator.createEvent<MonsterDiedEvent>({
               type: MonsterEngineEvents.MonsterDied,
               monster: this.monsters[event.target.id],
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
