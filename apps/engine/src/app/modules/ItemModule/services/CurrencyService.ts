import { EventParser } from '../../../EventParser';
import type { EngineEventHandler } from '../../../types';
import type { PlayerCharacterCreatedEvent } from '../../PlayerModule/Events';
import { PlayerEngineEvents } from '../../PlayerModule/Events';
import { QuestCompletedEvent, QuestEngineEvents } from '../../QuestModule/Events';
import type { AddCurrencyToCharacterEvent, CurrencyAmountUpdatedEvent, RemoveCurrencyFromCharacterEvent } from '../Events';
import { ItemEngineEvents } from '../Events';

export class CurrencyService extends EventParser {
    private currencyTracks: Record<string, number> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handleNewPlayerCreated,
            [ItemEngineEvents.RemoveCurrencyFromCharacter]: this.handleRemoveCurrencyFromCharacter,
            [ItemEngineEvents.AddCurrencyToCharacter]: this.handleAddCurrencyToCharacter,
            [QuestEngineEvents.QuestCompleted]: this.handleQuestCompleted,
        };
    }

    handleNewPlayerCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event }) => {
        this.currencyTracks[event.playerCharacter.id] = 243798;

        this.engineEventCrator.asyncCeateEvent<CurrencyAmountUpdatedEvent>({
            type: ItemEngineEvents.CurrencyAmountUpdated,
            characterId: event.playerCharacter.id,
            newAmount: this.currencyTracks[event.playerCharacter.id],
        });
    };

    handleRemoveCurrencyFromCharacter: EngineEventHandler<RemoveCurrencyFromCharacterEvent> = ({ event }) => {
        this.currencyTracks[event.characterId] = Math.max(0, this.currencyTracks[event.characterId] - event.amount);

        this.engineEventCrator.asyncCeateEvent<CurrencyAmountUpdatedEvent>({
            type: ItemEngineEvents.CurrencyAmountUpdated,
            characterId: event.characterId,
            newAmount: this.currencyTracks[event.characterId],
        });
    };

    handleAddCurrencyToCharacter: EngineEventHandler<AddCurrencyToCharacterEvent> = ({ event }) => {
        this.currencyTracks[event.characterId] = this.currencyTracks[event.characterId] + event.amount;

        this.engineEventCrator.asyncCeateEvent<CurrencyAmountUpdatedEvent>({
            type: ItemEngineEvents.CurrencyAmountUpdated,
            characterId: event.characterId,
            newAmount: this.currencyTracks[event.characterId],
        });
    };

    getCharacterMoneyById = (characterId: string) => this.currencyTracks[characterId];

    handleQuestCompleted: EngineEventHandler<QuestCompletedEvent> = ({ event, services }) => {
        const { questReward } = services.questSchemasService.getData()[event.questId];

        if (questReward.currency) {
            this.engineEventCrator.asyncCeateEvent<AddCurrencyToCharacterEvent>({
                type: ItemEngineEvents.AddCurrencyToCharacter,
                characterId: event.characterId,
                amount: questReward.currency,
            });
        }
    };
}
