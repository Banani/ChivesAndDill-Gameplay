import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import {
   AddCharacterHealthPointsEvent,
   AddCharacterSpellPowerEvent,
   CancelScheduledActionEvent,
   Character,
   CharacterDiedEvent,
   EngineEventHandler,
   NewPlayerCreatedEvent,
   ScheduleActionEvent,
   ScheduleActionTriggeredEvent,
   TakeCharacterHealthPointsEvent,
} from '../../../types';
import { MonsterDiedEvent, MonsterEngineEvents, NewMonsterCreatedEvent } from '../../MonsterModule/Events';

const SERVICE_PREFIX = 'Regeneration_';

interface Regeneration {
   targetId: string;
   spellPowerRegeneration: number;
   healthPointsRegeneration: number;
}

export class RegenerationService extends EventParser {
   private activeRegenerations: Record<string, Regeneration> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [EngineEvents.ScheduleActionTriggered]: this.handleScheduleActionTriggered,
         [MonsterEngineEvents.NewMonsterCreated]: this.handleNewMonsterCreated,
         [MonsterEngineEvents.MonsterDied]: this.handleMonsterDied,
      };
   }

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event }) => {
      this.scheduleRegenerations(event.payload.newCharacter);
   };

   handleNewMonsterCreated: EngineEventHandler<NewMonsterCreatedEvent> = ({ event }) => {
      this.scheduleRegenerations(event.monster);
   };

   scheduleRegenerations = (character: Character) => {
      this.activeRegenerations[`${SERVICE_PREFIX}${character.id}`] = {
         targetId: character.id,
         spellPowerRegeneration: character.spellPowerRegen,
         healthPointsRegeneration: character.healthPointsRegen,
      };

      this.engineEventCrator.asyncCeateEvent<ScheduleActionEvent>({
         type: EngineEvents.ScheduleAction,
         id: `${SERVICE_PREFIX}${character.id}`,
         frequency: 1000,
      });
   };

   handleScheduleActionTriggered: EngineEventHandler<ScheduleActionTriggeredEvent> = ({ event }) => {
      const regeneration = this.activeRegenerations[event.id];

      this.engineEventCrator.asyncCeateEvent<AddCharacterHealthPointsEvent>({
         type: EngineEvents.AddCharacterHealthPoints,
         casterId: null,
         characterId: regeneration.targetId,
         amount: regeneration.healthPointsRegeneration,
      });

      this.engineEventCrator.asyncCeateEvent<AddCharacterSpellPowerEvent>({
         type: EngineEvents.AddCharacterSpellPower,
         characterId: regeneration.targetId,
         amount: regeneration.spellPowerRegeneration,
      });
   };

   cleanAfterCharacter = (id: string) => {
      delete this.activeRegenerations[id];

      this.engineEventCrator.asyncCeateEvent<CancelScheduledActionEvent>({
         type: EngineEvents.CancelScheduledAction,
         id: `${SERVICE_PREFIX}${id}`,
      });
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      this.cleanAfterCharacter(event.character.id);
   };

   handleMonsterDied: EngineEventHandler<MonsterDiedEvent> = ({ event }) => {
      this.cleanAfterCharacter(event.monster.id);
   };
}
