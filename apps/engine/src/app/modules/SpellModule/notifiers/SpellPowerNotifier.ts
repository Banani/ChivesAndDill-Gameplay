import { GlobalStoreModule, PowerStackType } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { CharacterGainPowerStackEvent, CharacterLosePowerStackEvent, SpellEngineEvents } from '../Events';

export class SpellPowerNotifier extends Notifier<Partial<Record<PowerStackType, number>>> {
   constructor() {
      super({ key: GlobalStoreModule.POWER_STACKS });
      this.eventsToHandlersMap = {
         [SpellEngineEvents.CharacterGainPowerStack]: this.handleCharacterGainPowerStack,
         [SpellEngineEvents.CharacterLosePowerStack]: this.handleCharacterLosePowerStack,
      };
   }

   handleCharacterGainPowerStack: EngineEventHandler<CharacterGainPowerStackEvent> = ({ event }) => {
      this.broadcastObjectsUpdate({
         objects: {
            [event.characterId]: {
               [event.powerStackType]: event.currentAmount,
            },
         },
      });
   };

   handleCharacterLosePowerStack: EngineEventHandler<CharacterLosePowerStackEvent> = ({ event }) => {
      this.broadcastObjectsUpdate({
         objects: {
            [event.characterId]: {
               [event.powerStackType]: event.currentAmount,
            },
         },
      });
   };
}
