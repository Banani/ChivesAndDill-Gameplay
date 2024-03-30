import { EquipItem, EquipmentSlot, EquipmentTrack, ItemClientActions, ItemTemplateType, PossibleEquipmentPlaces, StripItem } from '@bananos/types';
import { findKey } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineActionHandler, EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import {
    EquipmentTrackCreatedEvent,
    ItemEngineEvents,
    ItemEquippedEvent,
    ItemStrippedEvent
} from '../Events';

const EquipmentSpotMap: Record<EquipmentSlot, PossibleEquipmentPlaces | PossibleEquipmentPlaces[]> = {
    [EquipmentSlot.Head]: 'head',
    [EquipmentSlot.Neck]: 'neck',
    [EquipmentSlot.Shoulder]: 'shoulder',
    [EquipmentSlot.Back]: 'back',
    [EquipmentSlot.Chest]: 'chest',
    [EquipmentSlot.Shirt]: 'shirt',
    [EquipmentSlot.Tabard]: 'tabard',
    [EquipmentSlot.Wrist]: 'wrist',

    [EquipmentSlot.Hands]: 'hands',
    [EquipmentSlot.Waist]: 'waist',
    [EquipmentSlot.Legs]: 'legs',
    [EquipmentSlot.Feet]: 'feet',
    [EquipmentSlot.Finger]: ['finger1', 'finger2'],
    [EquipmentSlot.Trinket]: ['trinket1', 'trinket2'],
};

export class EquipmentService extends EventParser {
    // id usera => backpack spot => amount of spaces
    private equipment: Record<string, EquipmentTrack> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handleNewPlayerCreated,
            [ItemClientActions.EquipItem]: this.handlePlayerTriesToEquipItem,
            [ItemClientActions.StripItem]: this.handlePlayerTriesToStripItem,
        };
    }

    handlePlayerTriesToEquipItem: EngineActionHandler<EquipItem> = ({ event, services }) => {
        const item = services.itemService.getItemById(event.itemInstanceId);
        if (!item || item.ownerId !== event.requestingCharacterId) {
            this.sendErrorMessage(event.requestingCharacterId, 'Item does not exist.');
            return;
        }

        const itemTemplate = services.itemTemplateService.getData()[item.itemTemplateId];

        if (itemTemplate.type !== ItemTemplateType.Equipment) {
            this.sendErrorMessage(event.requestingCharacterId, 'You cannot equip that.');
            return;
        }

        let targetSlot = EquipmentSpotMap[itemTemplate.slot];
        if (Array.isArray(targetSlot)) {
            for (let i in targetSlot) {
                if (!this.equipment[event.requestingCharacterId][targetSlot[i]]) {
                    targetSlot = targetSlot[i] as PossibleEquipmentPlaces;
                    break;
                }
            }

            if (Array.isArray(targetSlot)) {
                targetSlot = targetSlot[0];
            }
        }

        const itemOnThatSpot = this.equipment[event.requestingCharacterId][targetSlot];
        this.equipment[event.requestingCharacterId][targetSlot] = item.itemId;

        if (itemOnThatSpot) {
            this.engineEventCrator.asyncCeateEvent<ItemStrippedEvent>({
                type: ItemEngineEvents.ItemStripped,
                characterId: event.requestingCharacterId,
                slot: targetSlot,
                itemInstanceId: itemOnThatSpot,
                desiredLocation: services.backpackItemsService.findItemLocationInBag(event.requestingCharacterId, item.itemId),
            });
        }

        this.engineEventCrator.asyncCeateEvent<ItemEquippedEvent>({
            type: ItemEngineEvents.ItemEquipped,
            characterId: event.requestingCharacterId,
            slot: targetSlot,
            itemInstanceId: item.itemId,
        });
    };

    handlePlayerTriesToStripItem: EngineActionHandler<StripItem> = ({ event, services }) => {
        const item = services.itemService.getItemById(event.itemInstanceId);
        if (!item || item.ownerId !== event.requestingCharacterId) {
            this.sendErrorMessage(event.requestingCharacterId, 'Item does not exist.');
            return;
        }

        const slot = findKey(this.equipment[event.requestingCharacterId], (itemId) => itemId === event.itemInstanceId);

        if (!slot) {
            this.sendErrorMessage(event.requestingCharacterId, 'You do not wear that.');
            return;
        }

        this.equipment[event.requestingCharacterId][slot] = null;

        this.engineEventCrator.asyncCeateEvent<ItemStrippedEvent>({
            type: ItemEngineEvents.ItemStripped,
            characterId: event.requestingCharacterId,
            slot: slot as PossibleEquipmentPlaces,
            itemInstanceId: item.itemId,
            desiredLocation: event.desiredLocation,
        });
    };

    handleNewPlayerCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event }) => {
        this.equipment[event.playerCharacter.id] = {
            head: null,
            neck: null,
            shoulder: null,
            back: null,
            chest: null,
            shirt: null,
            tabard: null,
            wrist: null,

            hands: null,
            waist: null,
            legs: null,
            feet: null,
            finger1: null,
            finger2: null,
            trinket1: null,
            trinket2: null,

            mainHand: null,
            offHand: null,
        };

        this.engineEventCrator.asyncCeateEvent<EquipmentTrackCreatedEvent>({
            type: ItemEngineEvents.EquipmentTrackCreated,
            characterId: event.playerCharacter.id,
            equipmentTrack: this.equipment[event.playerCharacter.id],
        });
    };

    getCharacterEquipment = (characterId) => this.equipment[characterId];
}
