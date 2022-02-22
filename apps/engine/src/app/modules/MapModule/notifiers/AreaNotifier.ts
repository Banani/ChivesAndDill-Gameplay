import { GlobalStoreModule } from '@bananos/types';
import { AREAS, BORDER } from 'apps/engine/src/app/modules/MapModule/map';
import { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { NewPlayerCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';

export class AreaNotifier extends Notifier<number[][][]> {
   constructor() {
      super({ key: GlobalStoreModule.AREAS });
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
      };
   }

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
      this.multicastMultipleObjectsUpdate([
         {
            receiverId: event.playerId,
            objects: {
               area: AREAS,
               border: BORDER,
            },
         },
      ]);
   };
}
