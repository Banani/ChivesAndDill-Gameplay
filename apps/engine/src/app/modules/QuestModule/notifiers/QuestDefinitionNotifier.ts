import { GlobalStoreModule } from '@bananos/types';
import { QuestSchema } from 'libs/types/src/QuestPackage';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { ConversationWithNpcStartedEvent, NpcEngineEvents } from '../../NpcModule/Events';

export class QuestDefinitionNotifier extends Notifier<QuestSchema> {
   constructor() {
      super({ key: GlobalStoreModule.QUEST_DEFINITION });
      this.eventsToHandlersMap = {
         [NpcEngineEvents.ConversationWithNpcStarted]: this.handleConversationWithNpcStarted,
      };
   }

   handleConversationWithNpcStarted: EngineEventHandler<ConversationWithNpcStartedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type != CharacterType.Player) {
         return;
      }
      const npc = services.npcService.getNpcById(event.npcId);
      const { quests } = services.npcTemplateService.getData()[npc.templateId];

      if (!quests) {
         return;
      }

      this.multicastMultipleObjectsUpdate([{ receiverId: character.ownerId, objects: this.getOnlyFirstStage(quests) }]);
   };

   getOnlyFirstStage = (quests: Record<string, QuestSchema>) =>
      _.mapValues(quests, (quest) => ({
         name: quest.name,
         description: quest.description,
         stageOrder: [quest.stageOrder[0]],
         stages: {
            [quest.stageOrder[0]]: quest.stages[quest.stageOrder[0]],
         },
      }));
}
