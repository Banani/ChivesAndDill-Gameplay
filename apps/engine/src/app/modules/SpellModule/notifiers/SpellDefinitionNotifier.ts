import { CharacterType, GlobalStoreModule, RequestSpellDefinitions, SpellClientActions, SpellDefinition } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineActionHandler, EngineEventHandler } from '../../../types';
import { SpellDefinitionUpdatedEvent, SpellEngineEvents } from '../Events';

export class SpellDefinitionNotifier extends Notifier<SpellDefinition> {
    constructor() {
        super({ key: GlobalStoreModule.SPELL_DEFINITION });
        this.eventsToHandlersMap = {
            [SpellEngineEvents.SpellDefinitionUpdated]: this.handleSpellDefinitionUpdated,
            [SpellClientActions.RequestSpellDefinitions]: this.handlePlayerTriesToRequestSpellDefinitions
        };
    }

    handlePlayerTriesToRequestSpellDefinitions: EngineActionHandler<RequestSpellDefinitions> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.requestingCharacterId);
        if (character.type !== CharacterType.Player) {
            return;
        }

        const allSpells = services.spellService.getData();
        const spellDefinitions = _.chain(event.spellIds)
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
                receiverId: character.ownerId,
                objects: spellDefinitions,
            },
        ]);
    }

    handleSpellDefinitionUpdated: EngineEventHandler<SpellDefinitionUpdatedEvent> = ({ event, services }) => {
        this.broadcastObjectsDeletion({ objects: { [event.spellId]: null } });
    }
}
