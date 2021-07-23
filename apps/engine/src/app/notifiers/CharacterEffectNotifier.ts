import { EngineMessages } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';
import { EventParser } from '../EventParser';
import {
   CharacterDiedEvent,
   CharacterGotHpEvent,
   CharacterGotSpellPowerEvent,
   CharacterLostHpEvent,
   CharacterLostSpellPowerEvent,
   EngineEventHandler,
} from '../types';

export class CharacterEffectNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.CharacterGotHp]: this.handleCharacterGotHp,
         [EngineEvents.CharacterLostHp]: this.handleCharacterLostHp,
         [EngineEvents.CharacterGotSpellPower]: this.handleCharacterGotSpellPower,
         [EngineEvents.CharacterLostSpellPower]: this.handleCharacterLostSpellPower,
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
         characterId: event.character.id,
      });
   };
}
