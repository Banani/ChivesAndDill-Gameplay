import { EquipmentTrack, GlobalStoreModule, ItemClientMessages } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { EquipmentTrackCreatedEvent, ItemEngineEvents, PlayerTriesToEquipItemEvent } from '../Events';

export class EquipmentNotifier extends Notifier<EquipmentTrack> {
   constructor() {
      super({ key: GlobalStoreModule.EQUIPMENT });
      this.eventsToHandlersMap = {
         [ItemEngineEvents.EquipmentTrackCreated]: this.handleEquipmentTrackCreated,
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
   };

   handleEquipmentTrackCreated: EngineEventHandler<EquipmentTrackCreatedEvent> = ({ event, services }) => {
      const player = services.characterService.getCharacterById(event.characterId);
      if (player.type !== CharacterType.Player) {
         return;
      }

      this.multicastMultipleObjectsUpdate([
         {
            receiverId: player.ownerId,
            objects: { [event.characterId]: event.equipmentTrack },
         },
      ]);
   };
}
