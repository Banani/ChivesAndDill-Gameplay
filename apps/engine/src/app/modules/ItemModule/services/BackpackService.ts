import { BackpackTrack } from '@bananos/types';
import * as _ from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { AddItemToCharacterEvent, BackpackTrackCreatedEvent, CurrencyAmountUpdatedEvent, ItemAddedToCharacterEvent, ItemEngineEvents } from '../Events';

export class BackpackService extends EventParser {
   // id usera => backpack spot => amount of spaces
   private backpacks: Record<string, BackpackTrack> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handleNewPlayerCreated,
      };
   }

   handleNewPlayerCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event }) => {
      this.backpacks[event.playerCharacter.id] = {
         '1': 16,
         '2': null,
         '3': null,
         '4': null,
         '5': null,
      };

      this.engineEventCrator.asyncCeateEvent<BackpackTrackCreatedEvent>({
         type: ItemEngineEvents.BackpackTrackCreated,
         characterId: event.playerCharacter.id,
         backpackTrack: this.backpacks[event.playerCharacter.id],
      });
   };

   getBackpackSizes = (characterId: string) => this.backpacks[characterId];

   getAmountOfAllSlots = (characterId) => {
      return _.chain(this.backpacks[characterId])
         .filter((val) => val != null)
         .reduce((prev, current) => prev + current, 0)
         .value();
   };
}
