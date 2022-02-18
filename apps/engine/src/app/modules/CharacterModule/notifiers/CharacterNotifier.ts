import { GlobalStoreModule } from '@bananos/types';
import { cloneDeep } from 'lodash';
import { EventParser } from '../../../EventParser';
import type { MulticastPackage, Notifier } from '../../../Notifier';
import type { Character, EngineEventHandler } from '../../../types';
import { NewPlayerCreatedEvent, PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import type { NewCharacterCreatedEvent } from '../Events';
import { CharacterEngineEvents } from '../Events';

const emptyMulticastPackage: MulticastPackage = { key: GlobalStoreModule.CHARACTER, messages: {} };

export class CharacterNotifier extends EventParser implements Notifier {
   private characters: Record<string, Partial<Character>> = {};
   private multicast: MulticastPackage = cloneDeep(emptyMulticastPackage);

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   getBroadcast = () => {
      const characters = this.characters;

      this.characters = {};

      return { data: characters, key: GlobalStoreModule.CHARACTER, toDelete: [] };
   };

   getMulticast = () => {
      const tempMulticast = this.multicast;
      this.multicast = cloneDeep(emptyMulticastPackage);
      return tempMulticast;
   };

   handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event, services }) => {
      this.characters[event.character.id] = event.character;
   };

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      if (!this.multicast.messages[event.playerCharacter.ownerId]) {
         this.multicast.messages[event.playerCharacter.ownerId] = { events: [], data: {}, toDelete: [] };
      }
      this.multicast.messages[event.playerCharacter.ownerId].data = services.characterService.getAllCharacters();
   };
}
