import { EventParser } from '../EventParser';
import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';

export class CharactersService extends EventParser {
  characters: any = {
    monster_1: {
      id: 'monster_1',
      name: `#monster_1`,
      location: { x: 320, y: 640 },
      direction: CharacterDirection.DOWN,
      sprites: 'pigMan',
      isInMove: false,
    },
    monster_2: {
      id: 'monster_1',
      name: `#monster_2`,
      location: { x: 420, y: 640 },
      direction: CharacterDirection.DOWN,
      sprites: 'pigMan',
      isInMove: false,
    },
    monster_3: {
      id: 'monster_1',
      name: `#monster_3`,
      location: { x: 1020, y: 940 },
      direction: CharacterDirection.DOWN,
      sprites: 'pigMan',
      isInMove: false,
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
    };
  };

  getAllCharacters = () => this.characters;

  getCharacterById = (id) => this.characters[id];
}
