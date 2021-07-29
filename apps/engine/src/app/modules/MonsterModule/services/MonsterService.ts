import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import {
   AddCharacterHealthPointsEvent,
   AddCharacterSpellPowerEvent,
   CharacterGotHpEvent,
   CharacterLostHpEvent,
   CharacterType,
   EngineEventHandler,
   TakeCharacterHealthPointsEvent,
   TakeCharacterSpellPowerEvent,
} from '../../../types';
import {
   MonsterEngineEvents,
   CreateNewMonsterEvent,
   NewMonsterCreatedEvent,
   MonsterTargetChangedEvent,
   MonsterLostTargetEvent,
   MonsterDiedEvent,
   MonsterLostAggroEvent,
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
         [MonsterEngineEvents.MonsterLostAggro]: this.handleMonsterLostAggro,
         [EngineEvents.TakeCharacterHealthPoints]: this.handleTakeCharacterHealthPoints,
         [EngineEvents.AddCharacterHealthPoints]: this.handleAddCharacterHealthPoints,
         [EngineEvents.TakeCharacterSpellPower]: this.handleTakeCharacterSpellPower,
         [EngineEvents.AddCharacterSpellPower]: this.handleAddCharacterSpellPower,
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
         type: CharacterType.Monster,
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
         currentSpellPower: event.monsterRespawn.monsterTemplate.spellPower,
         maxSpellPower: event.monsterRespawn.monsterTemplate.spellPower,
         respawnId: event.monsterRespawn.id,
         sightRange: event.monsterRespawn.monsterTemplate.sightRange,
         escapeRange: event.monsterRespawn.monsterTemplate.escapeRange,
         spells: event.monsterRespawn.monsterTemplate.spells,
         attackFrequency: event.monsterRespawn.monsterTemplate.attackFrequency,
      };
      this.engineEventCrator.asyncCeateEvent<NewMonsterCreatedEvent>({
         type: MonsterEngineEvents.NewMonsterCreated,
         monster: this.monsters[id],
      });
   };

   handleTakeCharacterHealthPoints: EngineEventHandler<TakeCharacterHealthPointsEvent> = ({ event }) => {
      if (this.monsters[event.characterId]) {
         this.monsters[event.characterId].currentHp = Math.max(this.monsters[event.characterId].currentHp - event.amount, 0);

         this.engineEventCrator.asyncCeateEvent<CharacterLostHpEvent>({
            type: EngineEvents.CharacterLostHp,
            characterId: event.characterId,
            amount: event.amount,
            currentHp: this.monsters[event.characterId].currentHp,
         });

         if (this.monsters[event.characterId].currentHp === 0) {
            this.engineEventCrator.asyncCeateEvent<MonsterDiedEvent>({
               type: MonsterEngineEvents.MonsterDied,
               monster: this.monsters[event.characterId],
               killerId: event.attackerId,
            });
         }
      }
   };

   handleAddCharacterHealthPoints: EngineEventHandler<AddCharacterHealthPointsEvent> = ({ event }) => {
      if (this.monsters[event.characterId]) {
         this.monsters[event.characterId].currentHp = Math.min(
            this.monsters[event.characterId].currentHp + event.amount,
            this.monsters[event.characterId].maxHp
         );

         this.engineEventCrator.asyncCeateEvent<CharacterGotHpEvent>({
            type: EngineEvents.CharacterGotHp,
            characterId: event.characterId,
            amount: event.amount,
            currentHp: this.monsters[event.characterId].currentHp,
         });
      }
   };

   handleTakeCharacterSpellPower: EngineEventHandler<TakeCharacterSpellPowerEvent> = ({ event }) => {
      if (this.monsters[event.characterId]) {
         this.monsters[event.characterId].currentSpellPower -= event.amount;
      }
   };

   handleAddCharacterSpellPower: EngineEventHandler<AddCharacterSpellPowerEvent> = ({ event }) => {
      if (this.monsters[event.characterId]) {
         this.monsters[event.characterId].currentSpellPower = Math.min(
            this.monsters[event.characterId].currentSpellPower + event.amount,
            this.monsters[event.characterId].maxSpellPower
         );
      }
   };

   resetMonster = (monsterId: string) => {
      const monster = this.monsters[monsterId];
      const healthPointsToMax = monster.maxHp - monster.currentHp;

      monster.currentHp = monster.maxHp;
      monster.currentSpellPower = monster.maxSpellPower;

      this.engineEventCrator.asyncCeateEvent<CharacterGotHpEvent>({
         type: EngineEvents.CharacterGotHp,
         characterId: monsterId,
         amount: healthPointsToMax,
         currentHp: monster.currentHp,
      });
   };

   handleMonsterLostAggro: EngineEventHandler<MonsterLostAggroEvent> = ({ event }) => {
      if (this.monsters[event.monsterId]) {
         this.resetMonster(event.monsterId);
      }
   };

   handleMonsterDied: EngineEventHandler<MonsterDiedEvent> = ({ event }) => {
      delete this.monsters[event.monster.id];
   };

   getAllCharacters = () => this.monsters;
}
