import { EngineEvents } from '../../EngineEvents';
import { SpellType } from '../../SpellType';
import { Character } from '../Character';
import { Location } from '../Location';

export interface EngineEvent {
   type: EngineEvents;
}

export interface PlayerCastedSpellEvent extends EngineEvent {
   spellData: {
      characterId: string;
      spell: {
         type: SpellType;
         name: string;
         range: number;
         speed: number;
         damage: number;
         cooldown: number;
      };
      directionLocation: Location;
   };
}

export interface NewCharacterCreatedEvent extends EngineEvent {
   payload: {
      newCharacter: Character;
   };
}

export interface PlayerDisconnectedEvent extends EngineEvent {
   payload: {
      playerId: string;
   };
}
