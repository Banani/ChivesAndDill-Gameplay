import { GlobalStoreModule } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { QuestCompletedEvent, QuestEngineEvents } from '../../QuestModule/Events';

export class NpcQuestNotifier extends Notifier<Record<string, boolean>> {
    constructor() {
        super({ key: GlobalStoreModule.NPC_QUESTS });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
            [QuestEngineEvents.QuestCompleted]: this.handleQuestCompleted,
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const completedQuests = services.archivedQuestService.getCompletedQuests(event.playerCharacter.id);
        // npc => quest => boolean
        const questMap: Record<string, Record<string, boolean>> = _.chain(services.npcTemplateService.getData())
            .pickBy((template) => !!template.quests)
            .mapValues((template) =>
                _.chain(template.quests)
                    .mapValues(() => true)
                    .omitBy((_, key) => completedQuests[key])
                    .value()
            )
            .pickBy((quests) => Object.keys(quests).length > 0)
            .value();

        if (Object.keys(questMap).length > 0) {
            this.multicastMultipleObjectsUpdate([{ receiverId: event.playerCharacter.ownerId, objects: questMap }]);
        }
    };

    handleQuestCompleted: EngineEventHandler<QuestCompletedEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        const questMap: Record<string, Record<string, null>> = _.chain(services.npcTemplateService.getData())
            .pickBy((template) => !!template.quests && template.quests[event.questId])
            .mapValues(() => ({
                [event.questId]: null
            }))
            .value();

        this.multicastObjectsDeletion([{ receiverId, objects: questMap }]);
    };
}
