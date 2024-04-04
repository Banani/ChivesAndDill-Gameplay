import { BackpackTrack } from '@bananos/types';
import * as _ from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { BackpackTrackCreatedEvent, ItemEngineEvents } from '../Events';

export class BackpackService extends EventParser {
    // id usera => backpack spot => amount of spaces
    private backpacks: Record<string, BackpackTrack> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handleNewPlayerCreated,
        };
    }

    handleNewPlayerCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        this.backpacks[event.playerCharacter.id] = {
            '1': 16,
            '2': null,
            '3': null,
            '4': null,
            '5': null,
        };

        this.engineEventCrator.asyncCeateEvent<BackpackTrackCreatedEvent>({
            type: ItemEngineEvents.BackpackTrackCreated,
            characterId: event.playerCharacter.id,
            backpackTrack: this.backpacks[event.playerCharacter.id],
        });

        //TODO: remove this part after FE is done
        // [
        //     "64c00c36c2db32c8e3389b0d",
        //     "64c00ca0c2db32c8e3389b0e",
        //     "64c00d25c2db32c8e3389b0f",
        //     "64c00dbdc2db32c8e3389b10",
        //     "64c00e03c2db32c8e3389b11",
        //     "64c00e2bc2db32c8e3389b12",
        //     "64c00e4fc2db32c8e3389b13",
        //     "64c00e76c2db32c8e3389b14",
        //     "64c00f3bc2db32c8e3389b15",
        //     "64c00f99c2db32c8e3389b16",
        //     "64c0103bc2db32c8e3389b17",
        //     "64c010cec2db32c8e3389b18",
        //     "64c010f4c2db32c8e3389b19"
        // ].forEach(itemTemplateId => {
        //     this.engineEventCrator.asyncCeateEvent<GenerateItemForCharacterEvent>({
        //         type: ItemEngineEvents.GenerateItemForCharacter,
        //         characterId: event.playerCharacter.id,
        //         itemTemplateId,
        //         amount: 1,
        //     });
        // })

        // setTimeout(() => {
        //     _.forEach(_.pickBy(services.itemService.getAllItems(), item => item.ownerId === event.playerCharacter.id), (item, key) => {
        //         this.engineEventCrator.asyncCeateEvent<any>({
        //             type: ItemClientActions.EquipItem,
        //             requestingCharacterId: event.playerCharacter.id,
        //             itemInstanceId: key,
        //         });
        //     });
        // }, 0);
    };

    getBackpackSizes = (characterId: string) => this.backpacks[characterId];

    getAmountOfAllSlots = (characterId) => {
        return _.chain(this.backpacks[characterId])
            .filter((val) => val != null)
            .reduce((prev, current) => prev + current, 0)
            .value();
    };
}
