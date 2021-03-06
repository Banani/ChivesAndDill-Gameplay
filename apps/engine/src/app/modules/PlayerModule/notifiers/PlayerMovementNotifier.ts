import { ClientMessages, CommonClientMessages, GlobalStoreModule } from '@bananos/types';
import { mapValues, merge } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { Notifier } from '../../../Notifier';
import type {
   EngineEventHandler,
   PlayerStartedMovementEvent,
   PlayerTriesToStartedMovementEvent,
   PlayerStopedMovementVectorEvent,
   PlayerMovedEvent,
   PlayerStopedAllMovementVectorsEvent,
   Character,
} from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../Events';

// TODO: wrong type, it should not be Character
export class PlayerMovementNotifier extends Notifier<Character> {
   constructor() {
      super({ key: GlobalStoreModule.CHARACTER_MOVEMENTS });
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [EngineEvents.PlayerStopedAllMovementVectors]: this.handlePlayerStopedAllMovementVectors,
         [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
      };
   }

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);
      this.multicastMultipleObjectsUpdate([
         {
            receiverId: event.playerCharacter.ownerId,
            objects: mapValues(services.characterService.getAllCharacters(), (character: Character) => ({
               isInMove: character.isInMove,
               location: character.location,
               direction: character.direction,
            })),
         },
      ]);

      this.broadcastObjectsUpdate({
         objects: {
            [event.playerCharacter.id]: {
               isInMove: event.playerCharacter.isInMove,
               location: event.playerCharacter.location,
               direction: event.playerCharacter.direction,
            },
         },
      });

      currentSocket.on(CommonClientMessages.PlayerStartMove, (movement) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToStartedMovementEvent>({
            type: EngineEvents.PlayerTriesToStartedMovement,
            characterId: event.playerCharacter.id,
            movement,
         });
      });

      currentSocket.on(CommonClientMessages.PlayerStopMove, (movement) => {
         this.engineEventCrator.asyncCeateEvent<PlayerStopedMovementVectorEvent>({
            type: EngineEvents.PlayerStopedMovementVector,
            characterId: event.playerCharacter.id,
            movement,
         });
      });
   };

   handlePlayerStartedMovement: EngineEventHandler<PlayerStartedMovementEvent> = ({ event, services }) => {
      this.broadcastObjectsUpdate({
         objects: {
            [event.characterId]: { isInMove: true },
         },
      });
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event, services }) => {
      this.broadcastObjectsUpdate({
         objects: {
            [event.characterId]: { location: event.newLocation, direction: event.newCharacterDirection },
         },
      });
   };

   handlePlayerStopedAllMovementVectors: EngineEventHandler<PlayerStopedAllMovementVectorsEvent> = ({ event, services }) => {
      this.broadcastObjectsUpdate({
         objects: {
            [event.characterId]: { isInMove: false },
         },
      });
   };
}
