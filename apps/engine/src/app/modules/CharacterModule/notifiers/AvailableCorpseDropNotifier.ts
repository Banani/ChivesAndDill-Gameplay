import { GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import type { CorpseDropTrackCreatedEvent, CorpseDropTrackRemovedEvent } from '../Events';
import { CharacterEngineEvents } from '../Events';

export class AvailableCorpseDropNotifier extends Notifier<boolean> {
   constructor() {
      super({ key: GlobalStoreModule.CORPSE_DROP });
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.CorpseDropTrackCreated]: this.handleCorpseDropTrackCreated,
         [CharacterEngineEvents.CorpseDropTrackRemoved]: this.handleCorpseDropTrackRemoved,
      };
   }

   handleCorpseDropTrackCreated: EngineEventHandler<CorpseDropTrackCreatedEvent> = ({ event }) => {
      this.broadcastObjectsUpdate({
         objects: { [event.corpseId]: true },
      });
   };

   handleCorpseDropTrackRemoved: EngineEventHandler<CorpseDropTrackRemovedEvent> = ({ event }) => {
      this.broadcastObjectsDeletion({
         objects: { [event.corpseId]: null },
      });
   };
}
