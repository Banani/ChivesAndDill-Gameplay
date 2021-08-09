import { EngineMessages } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler, CharacterDiedEvent } from '../../../types';
import {
   CharacterEngineEvents,
   CharacterGotHpEvent,
   CharacterGotSpellPowerEvent,
   CharacterLostHpEvent,
   CharacterLostSpellPowerEvent,
} from '../../CharacterModule/Events';

export class CharacterEffectNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.CharacterGotHp]: this.handleCharacterGotHp,
         [CharacterEngineEvents.CharacterLostHp]: this.handleCharacterLostHp,
         [CharacterEngineEvents.CharacterGotSpellPower]: this.handleCharacterGotSpellPower,
         [CharacterEngineEvents.CharacterLostSpellPower]: this.handleCharacterLostSpellPower,
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

   handleCharacterGotHp: EngineEventHandler<CharacterGotHpEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.CharacterGotHp, {
         characterId: event.characterId,
         amount: event.amount,
         currentHp: event.currentHp,
      });
   };

   handleCharacterGotSpellPower: EngineEventHandler<CharacterGotSpellPowerEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.CharacterGotSpellPower, {
         characterId: event.characterId,
         amount: event.amount,
         currentSpellPower: event.currentSpellPower,
      });
   };

   handleCharacterLostSpellPower: EngineEventHandler<CharacterLostSpellPowerEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.CharacterLostSpellPower, {
         characterId: event.characterId,
         amount: event.amount,
         currentSpellPower: event.currentSpellPower,
      });
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.CharacterDied, {
         characterId: event.characterId,
      });
   };
}
