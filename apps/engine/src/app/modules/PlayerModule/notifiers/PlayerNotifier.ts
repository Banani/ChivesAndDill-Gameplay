import { GlobalStoreModule, PlayerClientActions } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { PlayerTriesToCastASpellEvent, SpellEngineEvents } from '../../SpellModule/Events';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../Events';

export class PlayerNotifier extends Notifier {
    constructor() {
        super({ key: GlobalStoreModule.PLAYER });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
        };
    }

    //TODO: Przeniesc to do spell modulu
    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

        currentSocket.on(PlayerClientActions.CastSpell, ({ directionLocation, spellId, targetId }) => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToCastASpellEvent>({
                type: SpellEngineEvents.PlayerTriesToCastASpell,
                spellData: {
                    characterId: event.playerCharacter.id,
                    spellId,
                    directionLocation,
                    targetId
                },
            });
        });
    };
}
