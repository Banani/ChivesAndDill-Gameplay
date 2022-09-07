import { Attributes } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import type { EngineEventHandler } from '../../../types';
import { AttributesUpdatedEvent, CharacterEngineEvents, NewCharacterCreatedEvent } from '../Events';

export class AttributesService extends EventParser {
   stats: Record<string, Attributes> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
      };
   }

   handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
      this.stats[event.character.id] = {
         armor: 0,
         stamina: 0,
         agility: 0,
         intelect: 0,
         strength: 0,
         spirit: 0,
      };

      this.engineEventCrator.asyncCeateEvent<AttributesUpdatedEvent>({
         type: CharacterEngineEvents.AttributesUpdated,
         characterId: event.character.id,
         attributes: this.stats[event.character.id],
      });
   };
}
