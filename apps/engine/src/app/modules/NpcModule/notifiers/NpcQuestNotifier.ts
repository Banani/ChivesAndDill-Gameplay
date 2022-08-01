import { GlobalStoreModule } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';

export class NpcQuestNotifier extends Notifier<Record<string, boolean>> {
   constructor() {
      super({ key: GlobalStoreModule.NPC_QUESTS });
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      const questMap: Record<string, Record<string, boolean>> = _.chain(services.npcTemplateService.getData())
         .pickBy((template) => !!template.quests)
         .mapValues((template) => _.mapValues(template.quests, () => true))
         .value();

      this.multicastMultipleObjectsUpdate([{ receiverId: event.playerCharacter.ownerId, objects: questMap }]);
   };
}
