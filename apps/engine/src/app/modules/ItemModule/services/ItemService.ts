import { DeleteItem, ItemClientActions } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineActionHandler, EngineEventHandler } from '../../../types';
import {
    AddItemToCharacterInventoryEvent,
    DeleteItemEvent,
    GenerateItemForCharacterEvent,
    ItemDeletedEvent,
    ItemEngineEvents
} from '../Events';

export class ItemService extends EventParser {
    private items: Record<string, { itemId: string; ownerId: string; itemTemplateId: string }> = {};
    private increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [ItemEngineEvents.GenerateItemForCharacter]: this.handleGenerateItemForCharacter,
            [ItemClientActions.DeleteItem]: this.handlePlayerTriesToDeleteItem,
            [ItemEngineEvents.DeleteItem]: this.handleDeleteItem,
        };
    }

    getItemById = (id: string) => this.items[id];

    getAllItems = () => this.items;

    handleGenerateItemForCharacter: EngineEventHandler<GenerateItemForCharacterEvent> = ({ event, services }) => {
        if (!services.itemTemplateService.getData()[event.itemTemplateId]) {
            return;
        }

        const amountToGenerate = event.amount ?? 1;
        const stackSize = services.itemTemplateService.getData()[event.itemTemplateId].stack ?? 1;

        for (let i = 0; i < amountToGenerate / stackSize; i++) {
            const itemId = `ItemInstance_${this.increment++}`;
            this.items[itemId] = { itemId, ownerId: event.characterId, itemTemplateId: event.itemTemplateId };

            let amount = stackSize;
            if (i + 1 > amountToGenerate / stackSize) {
                amount = amountToGenerate % stackSize;
            }

            this.engineEventCrator.asyncCeateEvent<AddItemToCharacterInventoryEvent>({
                type: ItemEngineEvents.AddItemToCharacterInventory,
                characterId: event.characterId,
                desiredLocation: event.desiredLocation,
                itemId,
                amount,
            });
        }
    };

    handlePlayerTriesToDeleteItem: EngineActionHandler<DeleteItem> = ({ event }) => {
        if (!this.items[event.itemId] || this.items[event.itemId].ownerId !== event.requestingCharacterId) {
            this.sendErrorMessage(event.requestingCharacterId, 'Item does not exist.');
            return;
        }

        delete this.items[event.itemId];

        this.engineEventCrator.asyncCeateEvent<ItemDeletedEvent>({
            type: ItemEngineEvents.ItemDeleted,
            lastCharacterOwnerId: event.requestingCharacterId,
            itemId: event.itemId,
        });
    };

    handleDeleteItem: EngineEventHandler<DeleteItemEvent> = ({ event }) => {
        if (!this.items[event.itemId]) {
            return;
        }

        const lastCharacterOwnerId = this.items[event.itemId].ownerId;
        delete this.items[event.itemId];

        this.engineEventCrator.asyncCeateEvent<ItemDeletedEvent>({
            type: ItemEngineEvents.ItemDeleted,
            lastCharacterOwnerId,
            itemId: event.itemId,
        });
    };
}
