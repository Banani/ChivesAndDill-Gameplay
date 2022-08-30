import { EquipmentTrack, GlobalStoreModule, ItemClientMessages } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import {
   EquipmentTrackCreatedEvent,
   ItemEngineEvents,
   ItemEquippedEvent,
   ItemStrippedEvent,
   PlayerTriesToEquipItemEvent,
   PlayerTriesToStripItemEvent,
} from '../Events';

export class EquipmentNotifier extends Notifier<EquipmentTrack> {
   constructor() {
      super({ key: GlobalStoreModule.EQUIPMENT });
      this.eventsToHandlersMap = {
         [ItemEngineEvents.EquipmentTrackCreated]: this.handleEquipmentTrackCreated,
         [ItemEngineEvents.ItemEquipped]: this.handleItemEquipped,
         [ItemEngineEvents.ItemStripped]: this.handleItemStripped,
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

      currentSocket.on(ItemClientMessages.EquipItem, ({ itemInstanceId }) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToEquipItemEvent>({
            type: ItemEngineEvents.PlayerTriesToEquipItem,
            requestingCharacterId: event.playerCharacter.id,
            itemInstanceId,
         });
      });

      currentSocket.on(ItemClientMessages.StripItem, ({ itemInstanceId }) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToStripItemEvent>({
            type: ItemEngineEvents.PlayerTriesToStripItem,
            requestingCharacterId: event.playerCharacter.id,
            itemInstanceId,
         });
      });
   };

   handleItemEquipped: EngineEventHandler<ItemEquippedEvent> = ({ event, services }) => {
      const player = services.characterService.getCharacterById(event.characterId);
      if (player.type !== CharacterType.Player) {
         return;
      }

      this.broadcastObjectsUpdate({ objects: { [event.characterId]: { [event.slot]: event.itemInstanceId } } });
   };

   handleItemStripped: EngineEventHandler<ItemStrippedEvent> = ({ event, services }) => {
      const player = services.characterService.getCharacterById(event.characterId);
      if (player.type !== CharacterType.Player) {
         return;
      }

      this.broadcastObjectsDeletion({ objects: { [event.characterId]: { [event.slot]: null } } });
   };

   handleEquipmentTrackCreated: EngineEventHandler<EquipmentTrackCreatedEvent> = ({ event, services }) => {
      const player = services.characterService.getCharacterById(event.characterId);
      if (player.type !== CharacterType.Player) {
         return;
      }

      this.broadcastObjectsUpdate({
         objects: { [event.characterId]: event.equipmentTrack },
      });
   };
}
