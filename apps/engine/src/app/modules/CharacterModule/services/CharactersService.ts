import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import type {
   EngineEventHandler,
   NewPlayerCreatedEvent,
   PlayerDisconnectedEvent,
   PlayerStartedMovementEvent,
   PlayerStopedAllMovementVectorsEvent,
   PlayerMovedEvent,
   CharacterDiedEvent,
   Character,
} from '../../../types';
import { CharacterType } from '../../../types';
import { Classes } from '../../../types/Classes';
import type { PlayerCharacter } from '../../../types/PlayerCharacter';
import { SpellsPerClass } from '../../SpellModule/spells';
import { CharacterEngineEvents, CreateCharacterEvent, NewCharacterCreatedEvent } from '../Events';

export class CharactersService extends EventParser {
   characters: Record<string, Character> = {};
   increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.CreateCharacter]: this.handleCreateCharacter,
         [EngineEvents.PlayerDisconnected]: this.handlePlayerDisconnected,
         [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
         [EngineEvents.PlayerStopedAllMovementVectors]: this.handlePlayerStopedAllMovementVectors,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
      };
   }

   handleCreateCharacter: EngineEventHandler<CreateCharacterEvent> = ({ event }) => {
      this.characters[event.character.id] = event.character;

      this.engineEventCrator.asyncCeateEvent<NewCharacterCreatedEvent>({
         type: CharacterEngineEvents.NewCharacterCreated,
         character: event.character,
      });
   };

   handlePlayerDisconnected: EngineEventHandler<PlayerDisconnectedEvent> = ({ event }) => {
      delete this.characters[event.payload.playerId];
   };

   handlePlayerStartedMovement: EngineEventHandler<PlayerStartedMovementEvent> = ({ event }) => {
      if (this.characters[event.characterId]) {
         this.characters[event.characterId].isInMove = true;
      }
   };

   handlePlayerStopedAllMovementVectors: EngineEventHandler<PlayerStopedAllMovementVectorsEvent> = ({ event }) => {
      if (this.characters[event.characterId]) {
         this.characters[event.characterId].isInMove = false;
      }
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
      if (this.characters[event.characterId]) {
         this.characters[event.characterId].location = event.newLocation;
         this.characters[event.characterId].direction = event.newCharacterDirection;
      }
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      delete this.characters[event.characterId];
   };

   getAllCharacters = () => this.characters;

   getCharacterById = (id) => this.characters[id];
}
