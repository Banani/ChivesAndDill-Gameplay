import { CharacterType, CorpseLoot, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { Services } from '../../../types/Services';
import {
    AllItemsWerePickedFromCorpseEvent,
    CharacterEngineEvents,
    CoinsWerePickedFromCorpseEvent,
    ItemWasPickedFromCorpseEvent,
} from '../../CharacterModule/Events';
import {
    LootClosedEvent,
    LootOpenedEvent,
    PlayerEngineEvents
} from '../Events';

export class ActiveLootNotifier extends Notifier<CorpseLoot> {
    constructor() {
        super({ key: GlobalStoreModule.ACTIVE_LOOT });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.LootOpened]: this.handleLootOpened,
            [PlayerEngineEvents.LootClosed]: this.handleLootClosed,
            [CharacterEngineEvents.ItemWasPickedFromCorpse]: this.handleItemWasPickedFromCorpse,
            [CharacterEngineEvents.AllItemsWerePickedFromCorpse]: this.handleAllItemsWerePickedFromCorpse,
            [CharacterEngineEvents.CoinsWerePickedFromCorpse]: this.handleCoinsWerePickedFromCorpse,
        };
    }

    handleLootOpened: EngineEventHandler<LootOpenedEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastMultipleObjectsUpdate([{ receiverId, objects: { [event.corpseId]: event.corpseDropTrack.loot } }]);
    };

    handleLootClosed: EngineEventHandler<LootClosedEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastObjectsDeletion([
            {
                receiverId,
                objects: { [event.corpseId]: null },
            },
        ]);
    };

    handleItemWasPickedFromCorpse: EngineEventHandler<ItemWasPickedFromCorpseEvent> = ({ event, services }) => {
        const ownerIds = this.getAllCorpseWatchers(services, event.corpseId);

        if (ownerIds.length > 0) {
            this.multicastObjectsDeletion(
                ownerIds.map((ownerId) => ({
                    receiverId: ownerId,
                    objects: { [event.corpseId]: { items: { [event.itemId]: null } } },
                }))
            );
        }
    };

    handleCoinsWerePickedFromCorpse: EngineEventHandler<CoinsWerePickedFromCorpseEvent> = ({ event, services }) => {
        const ownerIds = this.getAllCorpseWatchers(services, event.corpseId);

        if (ownerIds.length > 0) {
            this.multicastObjectsDeletion(
                ownerIds.map((ownerId) => ({
                    receiverId: ownerId,
                    objects: { [event.corpseId]: { coins: null } },
                }))
            );
        }
    };

    handleAllItemsWerePickedFromCorpse: EngineEventHandler<AllItemsWerePickedFromCorpseEvent> = ({ event, services }) => {
        const ownerIds = this.getAllCorpseWatchers(services, event.corpseId);

        if (ownerIds.length > 0) {
            this.multicastObjectsDeletion(
                ownerIds.map((ownerId) => ({
                    receiverId: ownerId,
                    objects: { [event.corpseId]: { items: null } },
                }))
            );
        }
    };

    getAllCorpseWatchers = (services: Services, corpseId: string) => {
        const characterIds = services.activeLootService.getAllCharacterIdsWithThatCorpseOpened(corpseId);
        return characterIds
            .map((id) => services.characterService.getCharacterById(id))
            .filter((character) => character.type === CharacterType.Player)
            .map((character: PlayerCharacter) => character.ownerId);
    };
}
