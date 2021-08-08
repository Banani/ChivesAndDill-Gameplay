import { ChannelingTrack } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { SpellChannelingFinishedEvent, SpellChannelingInterruptedEvent, SpellChannelingStartedEvent, SpellEngineEvents } from '../Events';

export class ChannelingNotifier extends EventParser implements Notifier {
   private channelings: Record<string, ChannelingTrack> = {};
   private toDelete: string[] = [];

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.SpellChannelingStarted]: this.handleSpellChannelingStarted,
         [SpellEngineEvents.SpellChannelingFinished]: this.handleSpellChannelingFinished,
         [SpellEngineEvents.SpellChannelingInterrupted]: this.handleSpellChannelingInterrupted,
      };
   }

   getBroadcast = () => {
      const channelings = this.channelings;
      const toDelete = [...this.toDelete];

      this.channelings = {};
      this.toDelete = [];

      return { data: channelings, key: 'spellChannels', toDelete };
   };

   handleSpellChannelingStarted: EngineEventHandler<SpellChannelingStartedEvent> = ({ event }) => {
      this.channelings[event.channelId] = {
         channelId: event.channelId,
         timeToCast: event.spell.channelTime,
         castingStartedTimestamp: event.channelingStartedTime,
         casterId: event.casterId,
      };
   };

   handleSpellChannelingFinished: EngineEventHandler<SpellChannelingFinishedEvent> = ({ event }) => {
      this.toDelete.push(event.channelId);
      delete this.channelings[event.channelId];
   };

   handleSpellChannelingInterrupted: EngineEventHandler<SpellChannelingInterruptedEvent> = ({ event }) => {
      this.toDelete.push(event.channelId);
      delete this.channelings[event.channelId];
   };
}
