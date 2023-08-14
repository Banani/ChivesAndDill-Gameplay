import { GlobalStoreModule, ItemClientActions, ItemTemplate } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { ItemEngineEvents, PlayerTriesToDeleteItemEvent } from '../Events';

export class ItemNotifier extends Notifier<ItemTemplate> {
    constructor() {
        super({ key: GlobalStoreModule.ITEMS });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

        currentSocket.on(ItemClientActions.Deleteitem, ({ itemId }) => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToDeleteItemEvent>({
                type: ItemEngineEvents.PlayerTriesToDeleteItem,
                requestingCharacterId: event.playerCharacter.id,
                itemId,
            });
        });

        currentSocket.on(ItemClientActions.RequestItemTemplates, ({ itemTemplateIds }) => {
            const allItemTemplates = services.itemTemplateService.getData();
            const itemTemplates = _.chain(itemTemplateIds)
                .map((id) => ({ id }))
                .keyBy('id')
                .mapValues(({ id }) => allItemTemplates[id])
                .value();

            this.multicastMultipleObjectsUpdate([
                {
                    receiverId: event.playerCharacter.ownerId,
                    objects: itemTemplates,
                },
            ]);
        });
    };
}
