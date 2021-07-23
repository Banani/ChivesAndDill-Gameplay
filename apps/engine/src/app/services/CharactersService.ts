import { EventParser } from '../EventParser';
import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';
import type {
   AddCharacterHealthPointsEvent,
   AddCharacterSpellPowerEvent,
   Character,
   CharacterDiedEvent,
   CharacterGotHpEvent,
   CharacterGotSpellPowerEvent,
   CharacterLostHpEvent,
   CharacterLostSpellPowerEvent,
   CreateNewPlayerEvent,
   EngineEventHandler,
   NewCharacterCreatedEvent,
   PlayerDisconnectedEvent,
   PlayerMovedEvent,
   PlayerStartedMovementEvent,
   PlayerStopedAllMovementVectorsEvent,
   TakeCharacterHealthPointsEvent,
   TakeCharacterSpellPowerEvent,
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

         [EngineEvents.TakeCharacterHealthPoints]: this.handleTakeCharacterHealthPoints,
         [EngineEvents.AddCharacterHealthPoints]: this.handleAddCharacterHealthPoints,
         [EngineEvents.TakeCharacterSpellPower]: this.handleTakeCharacterSpellPower,
         [EngineEvents.AddCharacterSpellPower]: this.handleAddCharacterSpellPower,
      };
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

   handleTakeCharacterHealthPoints: EngineEventHandler<TakeCharacterHealthPointsEvent> = ({ event }) => {
      if (this.characters[event.characterId]) {
         this.characters[event.characterId].currentHp = Math.max(this.characters[event.characterId].currentHp - event.amount, 0);
         this.engineEventCrator.createEvent<CharacterLostHpEvent>({
            type: EngineEvents.CharacterLostHp,
            characterId: event.characterId,
            amount: event.amount,
            currentHp: this.characters[event.characterId].currentHp,
         });
         if (this.characters[event.characterId].currentHp === 0) {
            this.characters[event.characterId].isDead = true;
            this.engineEventCrator.createEvent<CharacterDiedEvent>({
               type: EngineEvents.CharacterDied,
               character: this.characters[event.characterId],
               killerId: event.attackerId,
            });
         }
      }
   };

   handleAddCharacterHealthPoints: EngineEventHandler<AddCharacterHealthPointsEvent> = ({ event }) => {
      if (this.characters[event.characterId]) {
         this.characters[event.characterId].currentHp = Math.min(
            this.characters[event.characterId].currentHp + event.amount,
            this.characters[event.characterId].maxHp
         );

         this.engineEventCrator.createEvent<CharacterGotHpEvent>({
            type: EngineEvents.CharacterGotHp,
            characterId: event.characterId,
            amount: event.amount,
            currentHp: this.characters[event.characterId].currentHp,
         });
      }
   };

   handleTakeCharacterSpellPower: EngineEventHandler<TakeCharacterSpellPowerEvent> = ({ event }) => {
      if (this.characters[event.characterId]) {
         this.characters[event.characterId].currentSpellPower -= event.amount;

         this.engineEventCrator.createEvent<CharacterLostSpellPowerEvent>({
            type: EngineEvents.CharacterLostSpellPower,
            characterId: event.characterId,
            amount: event.amount,
            currentSpellPower: this.characters[event.characterId].currentSpellPower,
         });
      }
   };

   handleAddCharacterSpellPower: EngineEventHandler<AddCharacterSpellPowerEvent> = ({ event }) => {
      if (this.characters[event.characterId]) {
         this.characters[event.characterId].currentSpellPower = Math.min(
            this.characters[event.characterId].currentSpellPower + event.amount,
            this.characters[event.characterId].maxSpellPower
         );

         this.engineEventCrator.createEvent<CharacterGotSpellPowerEvent>({
            type: EngineEvents.CharacterGotSpellPower,
            characterId: event.characterId,
            amount: event.amount,
            currentSpellPower: this.characters[event.characterId].currentSpellPower,
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
         currentHp: 1000,
         maxHp: 1000,
         currentSpellPower: 100,
         maxSpellPower: 100,
         size: 48,
         isDead: false,
      };
   };

   getAllCharacters = () => this.characters;

   getCharacterById = (id) => this.characters[id];

   canMove = (id) => !this.characters[id].isDead;

   canCastASpell = (id) => !this.characters[id].isDead;
}
