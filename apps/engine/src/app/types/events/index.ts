import { EngineEvents } from '../../EngineEvents';
import { SpellType } from '../../SpellType';
import { Character } from '../Character';
import { Location } from '../Location';
import { Services } from '../Services';

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

export interface CharacterDiedEvent extends EngineEvent {
   characterId: string;
}

export interface CharacterLostHpEvent extends EngineEvent {
   characterId: string;
   amount: number;
   currentHp: number;
}

export type EngineEventHandler<T> = ({ event, services }: { event: T; services: Services }) => void;

export interface EngineEventsMap {
   [EngineEvents.PlayerDisconnected]: EngineEventHandler<PlayerDisconnectedEvent>;
   [EngineEvents.CharacterDied]: EngineEventHandler<CharacterDiedEvent>;
   [EngineEvents.CharacterLostHp]: EngineEventHandler<CharacterLostHpEvent>;
}
