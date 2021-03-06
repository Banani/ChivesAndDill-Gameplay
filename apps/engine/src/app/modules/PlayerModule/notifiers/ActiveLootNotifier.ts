import { ActiveLootTrack, ClientMessages, CommonClientMessages, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { CloseLootEvent, LootClosedEvent, LootOpenedEvent, PlayerCharacterCreatedEvent, PlayerEngineEvents, PlayerTriesToOpenLootEvent } from '../Events';

export class ActiveLootNotifier extends Notifier<ActiveLootTrack> {
   constructor() {
      super({ key: GlobalStoreModule.ACTIVE_LOOT });
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
         [PlayerEngineEvents.LootOpened]: this.handleLootOpened,
         [PlayerEngineEvents.LootClosed]: this.handleLootClosed,
      };
   }

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

      currentSocket.on(CommonClientMessages.OpenLoot, ({ corpseId }) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToOpenLootEvent>({
            type: PlayerEngineEvents.PlayerTriesToOpenLoot,
            characterId: event.playerCharacter.id,
            corpseId,
         });
      });

      currentSocket.on(CommonClientMessages.CloseLoot, () => {
         this.engineEventCrator.asyncCeateEvent<CloseLootEvent>({
            type: PlayerEngineEvents.CloseLoot,
            characterId: event.playerCharacter.id,
         });
      });
   };

   handleLootOpened: EngineEventHandler<LootOpenedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type != CharacterType.Player) {
         return;
      }

      this.multicastMultipleObjectsUpdate([{ receiverId: character.ownerId, objects: { [character.id]: { corpseId: event.corpseId, items: event.items } } }]);
   };

   handleLootClosed: EngineEventHandler<LootClosedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type != CharacterType.Player) {
         return;
      }

      this.multicastObjectsDeletion([
         {
            receiverId: character.ownerId,
            objects: { [event.characterId]: null },
         },
      ]);
   };
}
