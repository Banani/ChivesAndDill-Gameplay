import { CharacterDirection } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { CharacterType, EngineEventHandler } from '../../../types';
import { Classes } from '../../../types/Classes';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { CharacterEngineEvents, CreateCharacterEvent, NewCharacterCreatedEvent } from '../../CharacterModule/Events';
import { SpellsPerClass } from '../../SpellModule/spells';
import {
   CreateNewPlayerEvent,
   CreatePlayerCharacterEvent,
   NewPlayerCreatedEvent,
   PlayerCharacterCreatedEvent,
   PlayerDisconnectedEvent,
   PlayerEngineEvents,
} from '../Events';

export class PlayerCharacterService extends EventParser {
   increment: number = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.CreatePlayerCharacter]: this.handleCreatePlayerCharacter,
         [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
      };
   }

   handleCreatePlayerCharacter: EngineEventHandler<CreatePlayerCharacterEvent> = ({ event }) => {
      const newCharacter = this.generateCharacter({ name: event.name, className: event.class, ownerId: event.playerOwnerId });

      this.engineEventCrator.asyncCeateEvent<CreateCharacterEvent>({
         type: CharacterEngineEvents.CreateCharacter,
         character: newCharacter,
      });
   };

   handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
      if (event.character.type === CharacterType.Player) {
         this.engineEventCrator.asyncCeateEvent<PlayerCharacterCreatedEvent>({
            type: PlayerEngineEvents.PlayerCharacterCreated,
            playerCharacter: event.character,
         });
      }
   };

   generateCharacter: ({ className, name, ownerId }: { className: Classes; name: string; ownerId: string }) => PlayerCharacter = ({
      className,
      name,
      ownerId,
   }) => {
      this.increment++;
      return {
         type: CharacterType.Player,
         id: `player_${this.increment.toString()}`,
         name,
         location: { x: 50, y: 100 },
         direction: CharacterDirection.DOWN,
         sprites: 'citizen',
         avatar: '../../../../assets/spritesheets/avatars/dogAvatar.PNG',
         isInMove: false,
         speed: 4,
         healthPointsRegen: 5,
         spellPowerRegen: 5,
         size: 48,
         absorb: 0,
         isDead: false,
         class: className,
         spells: SpellsPerClass[className],
         ownerId,
      };
   };
}
