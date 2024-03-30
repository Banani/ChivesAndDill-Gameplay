import { ChannelType } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { ChatEngineEvents, SendChatMessageEvent } from '../../ChatModule/Events';
import { AddCurrencyToCharacterEvent, GenerateItemForCharacterEvent, ItemEngineEvents } from '../Events';

export class ItemMessagesService extends EventParser {
    constructor() {
        super();
        this.eventsToHandlersMap = {
            [ItemEngineEvents.AddCurrencyToCharacter]: this.handleAddCurrencyToCharacter,
            [ItemEngineEvents.GenerateItemForCharacter]: this.handleGenerateItemForCharacter
        };
    }

    handleGenerateItemForCharacter: EngineEventHandler<GenerateItemForCharacterEvent> = ({ event, services }) => {
        this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
            type: ChatEngineEvents.SendChatMessage,
            message: ``,
            details: {
                channelType: ChannelType.System,
                targetId: event.characterId,
                itemTemplateId: event.itemTemplateId,
                amount: event.amount
            }
        });
    };

    handleAddCurrencyToCharacter: EngineEventHandler<AddCurrencyToCharacterEvent> = ({ event, services }) => {
        this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
            type: ChatEngineEvents.SendChatMessage,
            message: `Received ${this.getFormatedText(event.amount)}.`,
            details: {
                channelType: ChannelType.System,
                targetId: event.characterId
            }
        });
    };

    getFormatedText = (amount: number) => {
        let currencyText = "";
        let remaining = amount;

        const coppers = remaining % 100;
        if (coppers > 0) {
            currencyText = coppers + " Copper";
        }

        remaining = (remaining - coppers)
        if (remaining <= 0) {
            return currencyText.trim();;
        }
        remaining = remaining / 100;

        const silvers = remaining % 100;
        if (silvers > 0) {
            currencyText = silvers + " Silver " + currencyText;
        }

        remaining = remaining - silvers;
        if (remaining <= 0) {
            return currencyText.trim();
        }

        const golds = remaining / 100;
        return (golds + " Gold " + currencyText).trim();;
    }
}
