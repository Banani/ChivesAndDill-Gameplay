import { GlobalStoreModule, PlayerClientActions } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { PlayerTriesToCastASpellEvent, SpellEngineEvents } from '../../SpellModule/Events';
import { CreatePlayerCharacterEvent, NewPlayerCreatedEvent, PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../Events';

export class PlayerNotifier extends Notifier {
    constructor() {
        super({ key: GlobalStoreModule.PLAYER });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
        };
    }

    handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
        const currentSocket = services.socketConnectionService.getSocketById(event.playerId);

        currentSocket.on(PlayerClientActions.CreateCharacter, (character) => {
            this.engineEventCrator.asyncCeateEvent<CreatePlayerCharacterEvent>({
                type: PlayerEngineEvents.CreatePlayerCharacter,
                playerOwnerId: event.playerId,
                name: character.name,
                characterClassId: character.characterClassId,
            });
        });
    };

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
