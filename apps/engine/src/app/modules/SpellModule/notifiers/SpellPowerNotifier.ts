import { GlobalStoreModule, PowerStackTrack, PowerStackType } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { CharacterGainPowerStackEvent, CharacterLosePowerStackEvent, SpellEngineEvents } from '../Events';

export class SpellPowerNotifier extends EventParser implements Notifier {
   private powerStacks: Record<string, Partial<Record<PowerStackType, number>>> = {};
   private toDelete: string[] = [];

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.CharacterGainPowerStack]: this.handleCharacterGainPowerStack,
         [SpellEngineEvents.CharacterLosePowerStack]: this.handleCharacterLosePowerStack,
      };
   }

   getBroadcast = () => {
      const powerStacks = this.powerStacks;
      const toDelete = [...this.toDelete];

      this.powerStacks = {};
      this.toDelete = [];

      return { data: powerStacks, key: GlobalStoreModule.POWER_STACKS, toDelete };
   };

   handleCharacterGainPowerStack: EngineEventHandler<CharacterGainPowerStackEvent> = ({ event }) => {
      if (!this.powerStacks[event.characterId]) {
         this.powerStacks[event.characterId] = {};
      }
      this.powerStacks[event.characterId][event.powerStackType] = event.currentAmount;
   };

   handleCharacterLosePowerStack: EngineEventHandler<CharacterLosePowerStackEvent> = ({ event }) => {
      if (!this.powerStacks[event.characterId]) {
         this.powerStacks[event.characterId] = {};
      }
      this.powerStacks[event.characterId][event.powerStackType] = event.currentAmount;
   };
}
