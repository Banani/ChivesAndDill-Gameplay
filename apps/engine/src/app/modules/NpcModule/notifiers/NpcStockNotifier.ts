import { ActiveNpcConversation, GlobalStoreModule } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { ConversationWithNpcStartedEvent, NpcEngineEvents } from '../Events';

export class NpcStockNotifier extends Notifier<ActiveNpcConversation> {
    constructor() {
        super({ key: GlobalStoreModule.NPC_STOCK });
        this.eventsToHandlersMap = {
            [NpcEngineEvents.ConversationWithNpcStarted]: this.handleConversationWithNpcStarted,
        };
    }

    handleConversationWithNpcStarted: EngineEventHandler<ConversationWithNpcStartedEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        const npc = services.npcService.getNpcById(event.npcId);
        const itemsStock = services.npcTemplateService.getData()[npc.templateId].stock;

        if (itemsStock) {
            const itemsIds = _.mapValues(itemsStock, () => true);
            this.multicastMultipleObjectsUpdate([{ receiverId, objects: { [event.npcId]: itemsIds } }]);
        }
    };
}
