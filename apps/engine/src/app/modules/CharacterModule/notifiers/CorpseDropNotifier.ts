import { GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import type { CorpseDropTrackCreatedEvent } from '../Events';
import { CharacterEngineEvents } from '../Events';

export class CorpseDropNotifier extends Notifier<boolean> {
   constructor() {
      super({ key: GlobalStoreModule.CORPSE_DROP });
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.CorpseDropTrackCreated]: this.handleCorpseDropTrackCreated,
      };
   }

   handleCorpseDropTrackCreated: EngineEventHandler<CorpseDropTrackCreatedEvent> = ({ event }) => {
      this.broadcastObjectsUpdate({
         objects: { [event.characterId]: true },
      });
   };
}
