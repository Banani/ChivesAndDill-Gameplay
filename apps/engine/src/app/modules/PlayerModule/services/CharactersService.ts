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
   TakeCharacterHealthPointsEvent,
   CharacterLostHpEvent,
   CharacterDiedEvent,
   AddCharacterHealthPointsEvent,
   CharacterGotHpEvent,
   TakeCharacterSpellPowerEvent,
   CharacterLostSpellPowerEvent,
   AddCharacterSpellPowerEvent,
   CharacterGotSpellPowerEvent,
} from '../../../types';
import { CharacterType } from '../../../types';
import { Classes } from '../../../types/Classes';
import type { Player } from '../../../types/Player';
import { ALL_SPELLS, SpellsPerClass } from '../../SpellModule/spells';

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

   handleTakeCharacterHealthPoints: EngineEventHandler<TakeCharacterHealthPointsEvent> = ({ event }) => {
      if (this.characters[event.characterId]) {
         this.characters[event.characterId].currentHp = Math.max(this.characters[event.characterId].currentHp - event.amount, 0);
         this.engineEventCrator.asyncCeateEvent<CharacterLostHpEvent>({
            type: EngineEvents.CharacterLostHp,
            characterId: event.characterId,
            amount: event.amount,
            currentHp: this.characters[event.characterId].currentHp,
         });
         if (this.characters[event.characterId].currentHp === 0) {
            this.characters[event.characterId].isDead = true;
            this.engineEventCrator.asyncCeateEvent<CharacterDiedEvent>({
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

         this.engineEventCrator.asyncCeateEvent<CharacterGotHpEvent>({
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

         this.engineEventCrator.asyncCeateEvent<CharacterLostSpellPowerEvent>({
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

         this.engineEventCrator.asyncCeateEvent<CharacterGotSpellPowerEvent>({
            type: EngineEvents.CharacterGotSpellPower,
            characterId: event.characterId,
            amount: event.amount,
            currentSpellPower: this.characters[event.characterId].currentSpellPower,
         });
      }
   };

   classesBaseStats: Record<Classes, Partial<Player>> = {
      [Classes.Tank]: {
         currentHp: 400,
         maxHp: 400,
         currentSpellPower: 0,
         maxSpellPower: 100,
      },
      [Classes.Healer]: {
         currentHp: 25000,
         maxHp: 25000,
         currentSpellPower: 2000,
         maxSpellPower: 2000,
      },
      [Classes.Hunter]: {
         currentHp: 180,
         maxHp: 180,
         currentSpellPower: 100,
         maxSpellPower: 100,
      },
      [Classes.Mage]: {
         currentHp: 180,
         maxHp: 180,
         currentSpellPower: 2000,
         maxSpellPower: 2000,
      },
   };

   generatePlayer: ({ socketId: string }) => Player = ({ socketId }) => {
      this.increment++;
      const characterClass = Classes.Healer;
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
         currentHp: 400,
         maxHp: 400,
         currentSpellPower: 100,
         maxSpellPower: 100,
         healthPointsRegen: 5,
         spellPowerRegen: 5,
         size: 48,
         isDead: false,
         class: characterClass,
         spells: SpellsPerClass[characterClass],
         ...this.classesBaseStats[characterClass],
      };
   };

   getAllCharacters = () => this.characters;

   getCharacterById = (id) => this.characters[id];

   canMove = (id) => !this.characters[id].isDead;

   canCastASpell = (id) => !this.characters[id].isDead;
}
