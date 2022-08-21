import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, CharacterType, EngineEventHandler } from '../../../types';
import { Classes } from '../../../types/Classes';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { CharacterEngineEvents, CreateCharacterEvent, NewCharacterCreatedEvent } from '../../CharacterModule/Events';
import { SpellsPerClass } from '../../SpellModule/spells';
import { CreatePlayerCharacterEvent, PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../Events';

export class PlayerCharacterService extends EventParser {
   increment: number = 0;
   characters: Record<string, PlayerCharacter> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
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
         this.characters[event.character.id] = event.character;
         this.engineEventCrator.asyncCeateEvent<PlayerCharacterCreatedEvent>({
            type: PlayerEngineEvents.PlayerCharacterCreated,
            playerCharacter: event.character,
         });
      }
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      if (this.characters[event.characterId]) {
         this.characters[event.characterId].isDead = true;
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
         id: `playerCharacter_${this.increment.toString()}`,
         name,
         location: { x: 50, y: 100 },
         direction: CharacterDirection.DOWN,
         sprites: 'citizen',
         avatar: '../../../../assets/spritesheets/avatars/dogAvatar.PNG',
         isInMove: false,
         speed: 24, //4
         healthPointsRegen: 5,
         spellPowerRegen: 5,
         size: 96,
         absorb: 0,
         isDead: false,
         class: className,
         spells: SpellsPerClass[className],
         ownerId,
      };
   };

   getAllCharacters = () => this.characters;
}
