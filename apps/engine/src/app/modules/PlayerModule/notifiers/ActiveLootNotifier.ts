import { CommonClientMessages, CorpseDropTrack, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { CharacterEngineEvents, ItemWasPickedFromCorpseEvent } from '../../CharacterModule/Events';
import {
   CloseLootEvent,
   LootClosedEvent,
   LootOpenedEvent,
   PlayerCharacterCreatedEvent,
   PlayerEngineEvents,
   PlayerTriesToOpenLootEvent,
   PlayerTriesToPickItemFromCorpseEvent,
} from '../Events';

export class ActiveLootNotifier extends Notifier<CorpseDropTrack> {
   constructor() {
      super({ key: GlobalStoreModule.ACTIVE_LOOT });
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
         [PlayerEngineEvents.LootOpened]: this.handleLootOpened,
         [PlayerEngineEvents.LootClosed]: this.handleLootClosed,
         [CharacterEngineEvents.ItemWasPickedFromCorpse]: this.handleItemWasPickedFromCorpse,
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

      currentSocket.on(CommonClientMessages.PickItemFromCorpse, ({ corpseId, itemId }) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToPickItemFromCorpseEvent>({
            type: PlayerEngineEvents.PlayerTriesToPickItemFromCorpse,
            requestingCharacterId: event.playerCharacter.id,
            corpseId,
            itemId,
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

      this.multicastMultipleObjectsUpdate([{ receiverId: character.ownerId, objects: { [event.corpseId]: event.corpseDropTrack } }]);
   };

   handleLootClosed: EngineEventHandler<LootClosedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type != CharacterType.Player) {
         return;
      }

      this.multicastObjectsDeletion([
         {
            receiverId: character.ownerId,
            objects: { [event.corpseId]: null },
         },
      ]);
   };

   handleItemWasPickedFromCorpse: EngineEventHandler<ItemWasPickedFromCorpseEvent> = ({ event, services }) => {
      const characterIds = services.activeLootService.getAllCharacterIdsWithThatCorpseOpened(event.corpseId);
      const ownerIds = characterIds
         .map((id) => services.characterService.getCharacterById(id))
         .filter((character) => character.type === CharacterType.Player)
         .map((character: PlayerCharacter) => character.ownerId);

      if (ownerIds.length > 0) {
         this.multicastObjectsDeletion(
            ownerIds.map((ownerId) => ({
               receiverId: ownerId,
               objects: { [event.corpseId]: { items: { [event.itemId]: null } } },
            }))
         );
      }
   };
}
