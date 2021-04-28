import { EventParser } from '../EventParser';
import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';
import _ from 'lodash';

export class CharactersService extends EventParser {
  characters: any = {
    monster_1: {
      id: 'monster_1',
      name: `#monster_1`,
      location: { x: 320, y: 640 },
      direction: CharacterDirection.DOWN,
      sprites: 'pigMan',
      isInMove: false,
      currentHp: 100,
      maxHp: 100,
      size: 50,
      isDead: false,
    },
    monster_2: {
      id: 'monster_2',
      name: `#monster_2`,
      location: { x: 420, y: 640 },
      direction: CharacterDirection.DOWN,
      sprites: 'pigMan',
      isInMove: false,
      currentHp: 100,
      maxHp: 100,
      size: 50,
      isDead: false,
    },
    monster_3: {
      id: 'monster_3',
      name: `#monster_3`,
      location: { x: 1020, y: 940 },
      direction: CharacterDirection.DOWN,
      sprites: 'pigMan',
      isInMove: false,
      currentHp: 100,
      maxHp: 100,
      size: 50,
      isDead: false,
    },
  };
  increment: number = 0;

  constructor() {
    super();
    this.eventsToHandlersMap = {
      [EngineEvents.CreateNewPlayer]: this.handleCreateNewPlayer,
      [EngineEvents.PlayerDisconnected]: this.handlePlayerDisconnected,
      [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
      [EngineEvents.PlayerStopedAllMovementVectors]: this
        .handlePlayerStopedAllMovementVectors,
      [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
      [EngineEvents.CharacterHit]: this.handleCharacterHit,
    };
  }

  handleCreateNewPlayer = ({ event }) => {
    const newCharacter = this.generatePlayer({
      socketId: event.payload.socketId,
    });
    this.characters[newCharacter.id] = newCharacter;

    this.engineEventCrator.createEvent({
      type: EngineEvents.NewCharacterCreated,
      payload: {
        newCharacter,
      },
    });
  };

  handlePlayerDisconnected = ({ event }) => {
    delete this.characters[event.payload.playerId];
  };

  handlePlayerStartedMovement = ({ event }) => {
    this.characters[event.characterId].isInMove = true;
  };

  handlePlayerStopedAllMovementVectors = ({ event }) => {
    this.characters[event.characterId].isInMove = false;
  };

  handlePlayerMoved = ({ event }) => {
    this.characters[event.characterId].location = event.newLocation;
    this.characters[event.characterId].direction = event.newCharacterDirection;
  };

  handleCharacterHit = ({ event }) => {
    this.characters[event.target.id].currentHp = Math.max(
      this.characters[event.target.id].currentHp - event.spell.damage,
      0
    );

    this.engineEventCrator.createEvent({
      type: EngineEvents.CharacterLostHp,
      characterId: event.target.id,
      amount: event.spell.damage,
      currentHp: this.characters[event.target.id].currentHp,
    });

    if (this.characters[event.target.id].currentHp === 0) {
      this.characters[event.target.id].isDead = true;
      this.engineEventCrator.createEvent({
        type: EngineEvents.CharacterDied,
        characterId: event.target.id,
      });
    }
  };

  generatePlayer = ({ socketId }) => {
    this.increment++;
    return {
      id: this.increment.toString(),
      name: `#player_${this.increment}`,
      location: { x: 20 * this.increment, y: 20 },
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
}
