import { EngineMessages, ClientMessages } from '@bananos/types';
import { mapValues, merge } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import type { Notifier } from '../../../Notifier';
import type {
   EngineEventHandler,
   PlayerStartedMovementEvent,
   PlayerTriesToStartedMovementEvent,
   PlayerStopedMovementVectorEvent,
   PlayerMovedEvent,
   PlayerStopedAllMovementVectorsEvent,
   Character,
} from '../../../types';
import { CharacterEngineEvents, NewCharacterCreatedEvent } from '../../CharacterModule/Events';
import { NewPlayerCreatedEvent, PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../Events';

export class PlayerMovementNotifier extends EventParser implements Notifier {
   private characters: Record<string, Partial<Character>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
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

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

      // BUG - should goes only to new player

      this.characters = mapValues(
         merge({}, services.characterService.getAllCharacters(), services.monsterService.getAllCharacters()),
         (character: Character) => ({
            isInMove: character.isInMove,
            location: character.location,
            direction: character.direction,
         })
      );

      currentSocket.on(ClientMessages.PlayerStartMove, (movement) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToStartedMovementEvent>({
            type: EngineEvents.PlayerTriesToStartedMovement,
            characterId: event.playerCharacter.id,
            movement,
         });
      });

      currentSocket.on(ClientMessages.PlayerStopMove, (movement) => {
         this.engineEventCrator.asyncCeateEvent<PlayerStopedMovementVectorEvent>({
            type: EngineEvents.PlayerStopedMovementVector,
            characterId: event.playerCharacter.id,
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
