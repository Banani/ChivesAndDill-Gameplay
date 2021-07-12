import { EngineMessages } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';
import { EventParser } from '../EventParser';
import { CharacterDiedEvent, CharacterLostHpEvent, EngineEventHandler } from '../types';

export class CharacterEffectNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.CharacterLostHp]: this.handleCharacterLostHp,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
      };
   }

   handleCharacterLostHp: EngineEventHandler<CharacterLostHpEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.CharacterLostHp, {
         characterId: event.characterId,
         amount: event.amount,
         currentHp: event.currentHp,
      });
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.CharacterDied, {
         characterId: event.character.id,
      });
   };
}
