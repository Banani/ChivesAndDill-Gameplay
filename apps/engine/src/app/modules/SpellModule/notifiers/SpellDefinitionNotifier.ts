import { GlobalStoreModule, SpellClientActions, SpellDefinition } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { SpellDefinitionUpdatedEvent, SpellEngineEvents } from '../Events';

export class SpellDefinitionNotifier extends Notifier<SpellDefinition> {
    constructor() {
        super({ key: GlobalStoreModule.SPELL_DEFINITION });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
            [SpellEngineEvents.SpellDefinitionUpdated]: this.handleSpellDefinitionUpdated
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

        currentSocket.on(SpellClientActions.RequestSpellDefinitions, ({ spellIds }) => {
            const allSpells = services.spellService.getData();
            const spellDefinitions = _.chain(spellIds)
                .map((id) => ({ id }))
                .keyBy('id')
                .mapValues(({ id }) => ({
                    id: allSpells[id].id,
                    name: allSpells[id].name,
                    description: allSpells[id].description,
                    image: allSpells[id].image,
                    range: allSpells[id].range,
                    cooldown: allSpells[id].cooldown,
                    spellPowerCost: allSpells[id].spellPowerCost,
                    requiredPowerStacks: allSpells[id].requiredPowerStacks
                }))
                .value();

            this.multicastMultipleObjectsUpdate([
                {
                    receiverId: event.playerCharacter.ownerId,
                    objects: spellDefinitions,
                },
            ]);
        });
    };

    handleSpellDefinitionUpdated: EngineEventHandler<SpellDefinitionUpdatedEvent> = ({ event, services }) => {
        this.broadcastObjectsDeletion({ objects: { [event.spellId]: null } });
    }
}
