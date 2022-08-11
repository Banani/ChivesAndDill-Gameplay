import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { NpcEngineEvents, PlayerTriesToFinalizeQuestWithNpcEvent, PlayerTriesToTakeQuestFromNpcEvent } from '../Events';

export class NpcQuestNotifier extends Notifier<Record<string, boolean>> {
   constructor() {
      super({ key: GlobalStoreModule.NPC_QUESTS });
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);
      const questMap: Record<string, Record<string, boolean>> = _.chain(services.npcTemplateService.getData())
         .pickBy((template) => !!template.quests)
         .mapValues((template) => _.mapValues(template.quests, () => true))
         .value();

      this.multicastMultipleObjectsUpdate([{ receiverId: event.playerCharacter.ownerId, objects: questMap }]);

      currentSocket.on(NpcClientMessages.TakeQuestFromNpc, ({ npcId, questId }) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToTakeQuestFromNpcEvent>({
            type: NpcEngineEvents.PlayerTriesToTakeQuestFromNpc,
            requestingCharacterId: event.playerCharacter.id,
            npcId,
            questId,
         });
      });

      currentSocket.on(NpcClientMessages.FinalizeQuestWithNpc, ({ npcId, questId }) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToFinalizeQuestWithNpcEvent>({
            type: NpcEngineEvents.PlayerTriesToFinalizeQuestWithNpc,
            requestingCharacterId: event.playerCharacter.id,
            npcId,
            questId,
         });
      });
   };
}
