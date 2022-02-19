import { HealthPointsSource, PowerPointsTrack } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, CharacterType, EngineEventHandler } from '../../../types';
import { Classes } from '../../../types/Classes';
import { MonsterEngineEvents, NewMonsterCreatedEvent } from '../../MonsterModule/Events';
import { MonsterRespawns } from '../../MonsterModule/MonsterRespawns';
import {
   AddCharacterHealthPointsEvent,
   AddCharacterSpellPowerEvent,
   CharacterEngineEvents,
   CharacterGotHpEvent,
   CharacterGotSpellPowerEvent,
   CharacterLostHpEvent,
   CharacterLostSpellPowerEvent,
   NewCharacterCreatedEvent,
   NewPowerTrackCreatedEvent,
   ResetCharacterEvent,
   TakeCharacterHealthPointsEvent,
   TakeCharacterSpellPowerEvent,
} from '../Events';

const classesBaseStats: Record<Classes, PowerPointsTrack> = {
   [Classes.Tank]: {
      currentHp: 400,
      maxHp: 400,
      currentSpellPower: 0,
      maxSpellPower: 100,
   },
   [Classes.Healer]: {
      currentHp: 25000,
      maxHp: 25000,
      currentSpellPower: 2000,
      maxSpellPower: 2000,
   },
   [Classes.Hunter]: {
      currentHp: 180,
      maxHp: 180,
      currentSpellPower: 100,
      maxSpellPower: 100,
   },
   [Classes.Mage]: {
      currentHp: 180,
      maxHp: 180,
      currentSpellPower: 2000,
      maxSpellPower: 2000,
   },
};

export class PowerPointsService extends EventParser {
   private powerPoints: Record<string, PowerPointsTrack> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
         [CharacterEngineEvents.TakeCharacterHealthPoints]: this.handleTakeCharacterHealthPoints,
         [CharacterEngineEvents.AddCharacterHealthPoints]: this.handleAddCharacterHealthPoints,
         [CharacterEngineEvents.TakeCharacterSpellPower]: this.handleTakeCharacterSpellPower,
         [CharacterEngineEvents.AddCharacterSpellPower]: this.handleAddCharacterSpellPower,
         [CharacterEngineEvents.ResetCharacter]: this.handleResetCharacter,
      };
   }

   handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
      if (event.character.type === CharacterType.Player) {
         this.powerPoints[event.character.id] = classesBaseStats[event.character.class];
      }

      if (event.character.type === CharacterType.Monster) {
         const respawn = MonsterRespawns[event.character.respawnId];
         this.powerPoints[event.character.id] = {
            currentHp: respawn.monsterTemplate.healthPoints,
            maxHp: respawn.monsterTemplate.healthPoints,
            currentSpellPower: respawn.monsterTemplate.spellPower,
            maxSpellPower: respawn.monsterTemplate.spellPower,
         };
      }

      this.engineEventCrator.asyncCeateEvent<NewPowerTrackCreatedEvent>({
         type: CharacterEngineEvents.NewPowerTrackCreated,
         powerPoints: this.powerPoints[event.character.id],
         characterId: event.character.id,
      });
   };

   handleTakeCharacterHealthPoints: EngineEventHandler<TakeCharacterHealthPointsEvent> = ({ event, services }) => {
      if (this.powerPoints[event.characterId]) {
         this.powerPoints[event.characterId].currentHp = Math.max(this.powerPoints[event.characterId].currentHp - event.amount, 0);
         this.engineEventCrator.asyncCeateEvent<CharacterLostHpEvent>({
            type: CharacterEngineEvents.CharacterLostHp,
            characterId: event.characterId,
            amount: event.amount,
            currentHp: this.powerPoints[event.characterId].currentHp,
         });
         if (this.powerPoints[event.characterId].currentHp === 0) {
            this.engineEventCrator.asyncCeateEvent<CharacterDiedEvent>({
               type: EngineEvents.CharacterDied,
               character: { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() }[event.characterId],
               characterId: event.characterId,
               killerId: event.attackerId,
            });
         }
      }
   };

   handleAddCharacterHealthPoints: EngineEventHandler<AddCharacterHealthPointsEvent> = ({ event }) => {
      if (this.powerPoints[event.characterId]) {
         this.powerPoints[event.characterId].currentHp = Math.min(
            this.powerPoints[event.characterId].currentHp + event.amount,
            this.powerPoints[event.characterId].maxHp
         );

         this.engineEventCrator.asyncCeateEvent<CharacterGotHpEvent>({
            type: CharacterEngineEvents.CharacterGotHp,
            characterId: event.characterId,
            amount: event.amount,
            currentHp: this.powerPoints[event.characterId].currentHp,
            source: event.source,
         });
      }
   };

   handleTakeCharacterSpellPower: EngineEventHandler<TakeCharacterSpellPowerEvent> = ({ event }) => {
      if (this.powerPoints[event.characterId]) {
         this.powerPoints[event.characterId].currentSpellPower -= event.amount;

         this.engineEventCrator.asyncCeateEvent<CharacterLostSpellPowerEvent>({
            type: CharacterEngineEvents.CharacterLostSpellPower,
            characterId: event.characterId,
            amount: event.amount,
            currentSpellPower: this.powerPoints[event.characterId].currentSpellPower,
         });
      }
   };

   handleAddCharacterSpellPower: EngineEventHandler<AddCharacterSpellPowerEvent> = ({ event }) => {
      if (this.powerPoints[event.characterId]) {
         this.powerPoints[event.characterId].currentSpellPower = Math.min(
            this.powerPoints[event.characterId].currentSpellPower + event.amount,
            this.powerPoints[event.characterId].maxSpellPower
         );

         this.engineEventCrator.asyncCeateEvent<CharacterGotSpellPowerEvent>({
            type: CharacterEngineEvents.CharacterGotSpellPower,
            characterId: event.characterId,
            amount: event.amount,
            currentSpellPower: this.powerPoints[event.characterId].currentSpellPower,
         });
      }
   };

   handleResetCharacter: EngineEventHandler<ResetCharacterEvent> = ({ event }) => {
      const character = this.powerPoints[event.characterId];
      const healthPointsToMax = character.maxHp - character.currentHp;

      character.currentHp = character.maxHp;
      character.currentSpellPower = character.maxSpellPower;

      this.engineEventCrator.asyncCeateEvent<CharacterGotHpEvent>({
         type: CharacterEngineEvents.CharacterGotHp,
         characterId: event.characterId,
         amount: healthPointsToMax,
         currentHp: character.currentHp,
         source: HealthPointsSource.CharacterReset,
      });
   };

   getAllPowerTracks = () => this.powerPoints;

   getHealthPoints = (id: string) => this.powerPoints[id].currentHp;

   getSpellPower = (id: string) => this.powerPoints[id].currentSpellPower;
}
