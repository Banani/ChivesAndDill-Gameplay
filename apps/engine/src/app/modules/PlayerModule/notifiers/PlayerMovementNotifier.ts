import { EngineMessages, ClientMessages } from '@bananos/types';
import { mapValues, merge } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import type { Notifier } from '../../../Notifier';
import type {
   EngineEventHandler,
   PlayerStartedMovementEvent,
   NewPlayerCreatedEvent,
   PlayerTriesToStartedMovementEvent,
   PlayerStopedMovementVectorEvent,
   PlayerMovedEvent,
   PlayerStopedAllMovementVectorsEvent,
   Character,
} from '../../../types';

export class PlayerMovementNotifier extends EventParser implements Notifier {
   private characters: Record<string, Partial<Character>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [EngineEvents.PlayerStopedAllMovementVectors]: this.handlePlayerStopedAllMovementVectors,
         [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
      };
   }

   getBroadcast = () => {
      const characterInformations = this.characters;

      this.characters = {};

      return { data: characterInformations, key: 'characterMovements', toDelete: [] };
   };

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
      const { newCharacter: currentCharacter } = event.payload;
      const currentSocket = services.socketConnectionService.getSocketById(currentCharacter.socketId);

      // BUG - should goes only to new player

      this.characters = mapValues(merge(services.characterService.getAllCharacters(), services.monsterService.getAllCharacters()), (character: Character) => ({
         isInMove: character.isInMove,
         location: character.location,
         direction: character.direction,
      }));

      currentSocket.on(ClientMessages.PlayerStartMove, (movement) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToStartedMovementEvent>({
            type: EngineEvents.PlayerTriesToStartedMovement,
            characterId: currentCharacter.id,
            movement,
         });
      });

      currentSocket.on(ClientMessages.PlayerStopMove, (movement) => {
         this.engineEventCrator.asyncCeateEvent<PlayerStopedMovementVectorEvent>({
            type: EngineEvents.PlayerStopedMovementVector,
            characterId: currentCharacter.id,
            movement,
         });
      });
   };

   handlePlayerStartedMovement: EngineEventHandler<PlayerStartedMovementEvent> = ({ event, services }) => {
      this.characters[event.characterId] = {
         ...this.characters[event.characterId],
         isInMove: true,
      };
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event, services }) => {
      this.characters[event.characterId] = {
         ...this.characters[event.characterId],
         location: event.newLocation,
         direction: event.newCharacterDirection,
      };
   };

   handlePlayerStopedAllMovementVectors: EngineEventHandler<PlayerStopedAllMovementVectorsEvent> = ({ event, services }) => {
      this.characters[event.characterId] = {
         ...this.characters[event.characterId],
         isInMove: false,
      };
   };
}
