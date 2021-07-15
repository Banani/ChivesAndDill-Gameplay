import { EventParser } from '../EventParser';
import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';
import type {
   Character,
   CharacterDiedEvent,
   CharacterHitEvent,
   CharacterLostHpEvent,
   CreateNewPlayerEvent,
   EngineEventHandler,
   NewCharacterCreatedEvent,
   PlayerDisconnectedEvent,
   PlayerMovedEvent,
   PlayerStartedMovementEvent,
   PlayerStopedAllMovementVectorsEvent,
} from '../types';

export class CharactersService extends EventParser {
   characters: Record<string, Character> = {};
   increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.CreateNewPlayer]: this.handleCreateNewPlayer,
         [EngineEvents.PlayerDisconnected]: this.handlePlayerDisconnected,
         [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
         [EngineEvents.PlayerStopedAllMovementVectors]: this.handlePlayerStopedAllMovementVectors,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [EngineEvents.CharacterHit]: this.handleCharacterHit,
      };

      for (let i = 1; i <= 100; i++) {
         this.characters[`monster_${i}`] = {
            id: `monster_${i}`,
            name: `#monster_${i}`,
            location: { x: 100 * (i / 10) + 100, y: 100 * (i % 10) + 100 },
            direction: CharacterDirection.DOWN,
            division: i % 3 === 0 ? 'PigFuckers' : 'PigSlut',
            sprites: 'pigMan',
            isInMove: false,
            currentHp: 100,
            maxHp: 100,
            size: 50,
            isDead: false,
         };
      }
   }

   handleCreateNewPlayer: EngineEventHandler<CreateNewPlayerEvent> = ({ event }) => {
      const newCharacter = this.generatePlayer({
         socketId: event.payload.socketId,
      });
      this.characters[newCharacter.id] = newCharacter;

      this.engineEventCrator.createEvent<NewCharacterCreatedEvent>({
         type: EngineEvents.NewCharacterCreated,
         payload: {
            newCharacter,
         },
      });
   };

   handlePlayerDisconnected: EngineEventHandler<PlayerDisconnectedEvent> = ({ event }) => {
      delete this.characters[event.payload.playerId];
   };

   handlePlayerStartedMovement: EngineEventHandler<PlayerStartedMovementEvent> = ({ event }) => {
      this.characters[event.characterId].isInMove = true;
   };

   handlePlayerStopedAllMovementVectors: EngineEventHandler<PlayerStopedAllMovementVectorsEvent> = ({ event }) => {
      this.characters[event.characterId].isInMove = false;
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
      this.characters[event.characterId].location = event.newLocation;
      this.characters[event.characterId].direction = event.newCharacterDirection;
   };

   handleCharacterHit: EngineEventHandler<CharacterHitEvent> = ({ event }) => {
      this.characters[event.target.id].currentHp = Math.max(this.characters[event.target.id].currentHp - event.spell.damage, 0);

      this.engineEventCrator.createEvent<CharacterLostHpEvent>({
         type: EngineEvents.CharacterLostHp,
         characterId: event.target.id,
         amount: event.spell.damage,
         currentHp: this.characters[event.target.id].currentHp,
      });

      if (this.characters[event.target.id].currentHp === 0) {
         this.characters[event.target.id].isDead = true;
         this.engineEventCrator.createEvent<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            character: event.target,
            killer: this.characters[event.attackerId],
         });
      }
   };

   generatePlayer: ({ socketId: string }) => Character = ({ socketId }) => {
      this.increment++;
      return {
         id: this.increment.toString(),
         name: `#player_${this.increment}`,
         location: { x: 950, y: 960 },
         direction: CharacterDirection.DOWN,
         sprites: 'nakedFemale',
         isInMove: false,
         socketId,
         currentHp: 100,
         maxHp: 100,
         size: 48,
         isDead: false,
      };
   };

   getAllCharacters = () => this.characters;

   getCharacterById = (id) => this.characters[id];

   canMove = (id) => !this.characters[id].isDead;

   canCastASpell = (id) => !this.characters[id].isDead;
}
