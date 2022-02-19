import { GlobalStoreModule } from '@bananos/types';
import { cloneDeep } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import type { MulticastPackage, Notifier } from '../../../Notifier';
import type { Character, EngineEventHandler } from '../../../types';
import { NewPlayerCreatedEvent, PlayerCharacterCreatedEvent, PlayerDisconnectedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import type { CharacterRemovedEvent, NewCharacterCreatedEvent } from '../Events';
import { CharacterEngineEvents } from '../Events';

const emptyMulticastPackage: MulticastPackage = { key: GlobalStoreModule.CHARACTER, messages: {} };

export class CharacterNotifier extends EventParser implements Notifier {
   private characters: Record<string, Partial<Character>> = {};
   private toDelete: string[] = [];
   private multicast: MulticastPackage = cloneDeep(emptyMulticastPackage);

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
         [CharacterEngineEvents.CharacterRemoved]: this.handleCharacterRemoved,
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   getBroadcast = () => {
      const characters = this.characters;
      const toDelete = this.toDelete;

      this.characters = {};
      this.toDelete = [];

      return { data: characters, key: GlobalStoreModule.CHARACTER, toDelete };
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

   handleCharacterRemoved: EngineEventHandler<CharacterRemovedEvent> = ({ event }) => {
      this.toDelete.push(event.character.id);
   };
}
