import { EquipmentTrack } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { EquipmentTrackCreatedEvent, ItemEngineEvents, PlayerTriesToEquipItemEvent } from '../Events';

export class EquipmentService extends EventParser {
   // id usera => backpack spot => amount of spaces
   private equipment: Record<string, EquipmentTrack> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handleNewPlayerCreated,
         [ItemEngineEvents.PlayerTriesToEquipItem]: this.handlePlayerTriesToEquipItem,
      };
   }

   handlePlayerTriesToEquipItem: EngineEventHandler<PlayerTriesToEquipItemEvent> = ({ event, services }) => {
      const item = services.itemService.getItemById(event.itemInstanceId);
      if (!item || item.ownerId !== event.requestingCharacterId) {
         this.sendErrorMessage(event.requestingCharacterId, 'Item does not exist.');
         return;
      }
   };

   handleNewPlayerCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event }) => {
      this.equipment[event.playerCharacter.id] = {
         head: null,
         neck: null,
         shoulder: null,
         back: null,
         chest: null,
         shirt: null,
         tabard: null,
         wrist: null,

         hands: null,
         waist: null,
         legs: null,
         feet: null,
         finger1: null,
         finger2: null,
         trinket1: null,
         trinket2: null,

         mainHand: null,
         offHand: null,
      };

      this.engineEventCrator.asyncCeateEvent<EquipmentTrackCreatedEvent>({
         type: ItemEngineEvents.EquipmentTrackCreated,
         characterId: event.playerCharacter.id,
         equipmentTrack: this.equipment[event.playerCharacter.id],
      });
   };
}
