import { ChannelingTrack, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { SpellChannelingFinishedEvent, SpellChannelingInterruptedEvent, SpellChannelingStartedEvent, SpellEngineEvents } from '../Events';

export class ChannelingNotifier extends Notifier<ChannelingTrack> {
   constructor() {
      super({ key: GlobalStoreModule.SPELL_CHANNELS });
      this.eventsToHandlersMap = {
         [SpellEngineEvents.SpellChannelingStarted]: this.handleSpellChannelingStarted,
         [SpellEngineEvents.SpellChannelingFinished]: this.handleSpellChannelingFinished,
         [SpellEngineEvents.SpellChannelingInterrupted]: this.handleSpellChannelingInterrupted,
      };
   }

   handleSpellChannelingStarted: EngineEventHandler<SpellChannelingStartedEvent> = ({ event }) => {
      this.broadcastObjectsUpdate({
         objects: {
            [event.channelId]: {
               channelId: event.channelId,
               timeToCast: event.spell.channelTime,
               castingStartedTimestamp: event.channelingStartedTime,
               casterId: event.casterId,
            },
         },
      });
   };

   handleSpellChannelingFinished: EngineEventHandler<SpellChannelingFinishedEvent> = ({ event }) => {
      this.broadcastObjectsDeletion({ ids: [event.channelId] });
   };

   handleSpellChannelingInterrupted: EngineEventHandler<SpellChannelingInterruptedEvent> = ({ event }) => {
      this.broadcastObjectsDeletion({ ids: [event.channelId] });
   };
}
