import { EngineMessages, ClientMessages } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';
import { EventParser } from '../EventParser';

export class CharacterEffectNotifier extends EventParser {
  constructor() {
    super();
    this.eventsToHandlersMap = {
      [EngineEvents.CharacterLostHp]: this.handleCharacterLostHp,
      [EngineEvents.CharacterDied]: this.handleCharacterDied,
    };
  }

  handleCharacterLostHp = ({ event, services }) => {
    services.socketConnectionService
      .getIO()
      .sockets.emit(EngineMessages.CharacterLostHp, {
        characterId: event.characterId,
        amount: event.amount,
        currentHp: event.currentHp,
      });
  };

  handleCharacterDied = ({ event, services }) => {
    services.socketConnectionService
      .getIO()
      .sockets.emit(EngineMessages.CharacterDied, {
        characterId: event.characterId,
      });
  };
}
