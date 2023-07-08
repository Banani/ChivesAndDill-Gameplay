import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import {
    AddCurrencyToCharacterEvent,
    DeleteItemEvent,
    GenerateItemForCharacterEvent,
    ItemEngineEvents,
    RemoveCurrencyFromCharacterEvent,
} from '../../ItemModule/Events';
import { NpcEngineEvents, PlayerTriesToBuyItemFromNpcEvent, PlayerTriesToSellItemToNpcEvent } from '../Events';

export class NpcTradeService extends EventParser {
    constructor() {
        super();
        this.eventsToHandlersMap = {
            [NpcEngineEvents.PlayerTriesToBuyItemFromNpc]: this.handlePlayerTriesToBuyItemFromNpc,
            [NpcEngineEvents.PlayerTriesToSellItemToNpc]: this.handlePlayerTriesToSellItemToNpc,
        };
    }

    handlePlayerTriesToBuyItemFromNpc: EngineEventHandler<PlayerTriesToBuyItemFromNpcEvent> = ({ event, services }) => {
        const npcIdThatCharacterIsTalkingWith = services.activeNpcConversationService.getConversationById(event.requestingCharacterId);
        if (npcIdThatCharacterIsTalkingWith !== event.npcId) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not talking with that NPC.');
            return;
        }

        const npc = services.npcService.getNpcById(npcIdThatCharacterIsTalkingWith);
        const npcTemplate = services.npcTemplateService.getData()[npc.templateId];
        if (!npcTemplate.stock[event.itemTemplateId]) {
            this.sendErrorMessage(event.requestingCharacterId, 'This npc is not selling that item.');
            return;
        }

        const amountToBuy = event.amount ?? 1;
        if (!services.backpackItemsService.canAddThanManyItems(event.requestingCharacterId, event.itemTemplateId, amountToBuy, services)) {
            this.sendErrorMessage(event.requestingCharacterId, 'You do not have enough space in your backpack.');
            return;
        }

        const itemPrice = services.itemTemplateService.getData()[event.itemTemplateId].value;
        const totalCost = amountToBuy * itemPrice;

        if (services.currencyService.getCharacterMoneyById(event.requestingCharacterId) < totalCost) {
            this.sendErrorMessage(event.requestingCharacterId, 'You do not have enough money.');
            return;
        }

        this.engineEventCrator.asyncCeateEvent<RemoveCurrencyFromCharacterEvent>({
            type: ItemEngineEvents.RemoveCurrencyFromCharacter,
            amount: totalCost,
            characterId: event.requestingCharacterId,
        });

        this.engineEventCrator.asyncCeateEvent<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            amount: event.amount,
            characterId: event.requestingCharacterId,
            itemTemplateId: event.itemTemplateId,
            desiredLocation: event.desiredLocation,
        });
    };

    handlePlayerTriesToSellItemToNpc: EngineEventHandler<PlayerTriesToSellItemToNpcEvent> = ({ event, services }) => {
        const npcIdThatCharacterIsTalkingWith = services.activeNpcConversationService.getConversationById(event.requestingCharacterId);
        if (npcIdThatCharacterIsTalkingWith !== event.npcId) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not talking with that NPC.');
            return;
        }

        const item = services.itemService.getItemById(event.itemId);
        if (!item) {
            this.sendErrorMessage(event.requestingCharacterId, 'You do not have that item.');
            return;
        }

        const itemPrice = services.itemTemplateService.getData()[item.itemTemplateId].value;
        const amount = services.backpackItemsService.getItemById(event.requestingCharacterId, item.itemId).amount;

        this.engineEventCrator.asyncCeateEvent<DeleteItemEvent>({
            type: ItemEngineEvents.DeleteItem,
            itemId: event.itemId,
        });

        this.engineEventCrator.asyncCeateEvent<AddCurrencyToCharacterEvent>({
            type: ItemEngineEvents.AddCurrencyToCharacter,
            amount: itemPrice * amount,
            characterId: event.requestingCharacterId,
        });
    };
}
