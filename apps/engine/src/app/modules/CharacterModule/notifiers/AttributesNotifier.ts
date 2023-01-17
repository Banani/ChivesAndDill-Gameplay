import { Attributes, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import type { AttributesUpdatedEvent } from '../Events';
import { CharacterEngineEvents } from '../Events';

export class AttributesNotifier extends Notifier<Attributes> {
   constructor() {
      super({ key: GlobalStoreModule.ATTRIBUTES });
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.AttributesUpdated]: this.handleNewCharacterCreated,
      };
   }

   handleNewCharacterCreated: EngineEventHandler<AttributesUpdatedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type != CharacterType.Player) {
         return;
      }

      this.multicastMultipleObjectsUpdate([{ receiverId: character.ownerId, objects: { [character.id]: event.attributes } }]);
   };
}
