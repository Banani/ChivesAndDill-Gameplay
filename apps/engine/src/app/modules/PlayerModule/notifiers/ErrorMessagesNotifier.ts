import { CharacterType, GlobalStoreModule, PlayerClientEvents } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerEngineEvents, SendErrorMessageEvent } from '../Events';

export class ErrorMessagesNotifier extends Notifier {
    constructor() {
        super({ key: GlobalStoreModule.ERROR_MESSAGES });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.SendErrorMessage]: this.handleSendErrorMessage,
        };
    }

    handleSendErrorMessage: EngineEventHandler<SendErrorMessageEvent> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.characterId);

        if (character.type !== CharacterType.Player) {
            return;
        }

        this.multicastEvents([
            {
                receiverId: character.ownerId,
                events: [
                    {
                        type: PlayerClientEvents.ErrorMessage,
                        message: event.message,
                    },
                ],
            },
        ]);
    };
}
