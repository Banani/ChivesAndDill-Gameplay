import { ActiveNpcConversation, GlobalStoreModule, NpcClientActions } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { ConversationWithNpcStartedEvent, NpcEngineEvents, PlayerTriesToBuyItemFromNpcEvent, PlayerTriesToSellItemToNpcEvent } from '../Events';

export class NpcStockNotifier extends Notifier<ActiveNpcConversation> {
    constructor() {
        super({ key: GlobalStoreModule.NPC_STOCK });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
            [NpcEngineEvents.ConversationWithNpcStarted]: this.handleConversationWithNpcStarted,
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

        currentSocket.on(NpcClientActions.BuyItemFromNpc, ({ npcId, itemTemplateId, amount, desiredLocation }) => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToBuyItemFromNpcEvent>({
                type: NpcEngineEvents.PlayerTriesToBuyItemFromNpc,
                requestingCharacterId: event.playerCharacter.id,
                npcId,
                itemTemplateId,
                amount,
                desiredLocation,
            });
        });

        currentSocket.on(NpcClientActions.SellItemToNpc, ({ npcId, itemId }) => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToSellItemToNpcEvent>({
                type: NpcEngineEvents.PlayerTriesToSellItemToNpc,
                requestingCharacterId: event.playerCharacter.id,
                npcId,
                itemId,
            });
        });
    };

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
