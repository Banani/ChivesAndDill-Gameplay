import { CharacterType, GlobalStoreModule, ItemClientActions, ItemTemplate, RequestItemTemplates } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineActionHandler } from '../../../types';

export class ItemNotifier extends Notifier<ItemTemplate> {
    constructor() {
        super({ key: GlobalStoreModule.ITEMS });
        this.eventsToHandlersMap = {
            [ItemClientActions.RequestItemTemplates]: this.handlePlayerTriesToRequestItemTemplates
        };
    }

    handlePlayerTriesToRequestItemTemplates: EngineActionHandler<RequestItemTemplates> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.requestingCharacterId);
        if (character.type !== CharacterType.Player) {
            return;
        }

        const allItemTemplates = services.itemTemplateService.getData();
        const itemTemplates = _.chain(event.itemTemplateIds)
            .map((id) => ({ id }))
            .keyBy('id')
            .mapValues(({ id }) => allItemTemplates[id])
            .value();

        this.multicastMultipleObjectsUpdate([
            {
                receiverId: character.ownerId,
                objects: itemTemplates,
            },
        ]);
    }
}
