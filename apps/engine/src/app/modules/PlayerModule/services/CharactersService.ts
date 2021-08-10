import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import type {
   EngineEventHandler,
   CreateNewPlayerEvent,
   NewPlayerCreatedEvent,
   PlayerDisconnectedEvent,
   PlayerStartedMovementEvent,
   PlayerStopedAllMovementVectorsEvent,
   PlayerMovedEvent,
   CharacterDiedEvent,
} from '../../../types';
import { CharacterType } from '../../../types';
import { Classes } from '../../../types/Classes';
import type { Player } from '../../../types/Player';
import { SpellsPerClass } from '../../SpellModule/spells';

export class CharactersService extends EventParser {
   characters: Record<string, Player> = {};
   increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.CreateNewPlayer]: this.handleCreateNewPlayer,
         [EngineEvents.PlayerDisconnected]: this.handlePlayerDisconnected,
         [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
         [EngineEvents.PlayerStopedAllMovementVectors]: this.handlePlayerStopedAllMovementVectors,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
      };
   }

   handleCreateNewPlayer: EngineEventHandler<CreateNewPlayerEvent> = ({ event }) => {
      const newCharacter = this.generatePlayer({
         socketId: event.payload.socketId,
      });
      this.characters[newCharacter.id] = newCharacter;

      this.engineEventCrator.asyncCeateEvent<NewPlayerCreatedEvent>({
         type: EngineEvents.NewPlayerCreated,
         payload: {
            newCharacter,
         },
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

   generatePlayer: ({ socketId: string }) => Player = ({ socketId }) => {
      this.increment++;
      const characterClass = Classes.Mage;
      return {
         type: CharacterType.Player,
         id: `player_${this.increment.toString()}`,
         name: `#player_${this.increment}`,
         location: { x: 950, y: 960 },
         direction: CharacterDirection.DOWN,
         sprites: 'citizen',
         isInMove: false,
         socketId,
         speed: 10,
         healthPointsRegen: 5,
         spellPowerRegen: 5,
         size: 48,
         absorb: 0,
         isDead: false,
         class: characterClass,
         spells: SpellsPerClass[characterClass],
      };
   };

   getAllCharacters = () => this.characters;

   getCharacterById = (id) => this.characters[id];
}
