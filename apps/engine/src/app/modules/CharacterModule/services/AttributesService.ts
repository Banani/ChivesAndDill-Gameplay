import { Attributes, EquipmentItemTemplate } from '@bananos/types';
import { forEach } from 'lodash';
import { EventParser } from '../../../EventParser';
import type { EngineEventHandler } from '../../../types';
import { ItemEngineEvents, ItemEquippedEvent } from '../../ItemModule/Events';
import { AttributesUpdatedEvent, CharacterEngineEvents, NewCharacterCreatedEvent } from '../Events';

export class AttributesService extends EventParser {
   stats: Record<string, Attributes> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
         [ItemEngineEvents.ItemEquipped]: this.handleItemEquipped,
      };
   }

   handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
      this.stats[event.character.id] = {
         armor: 0,
         stamina: 0,
         agility: 0,
         intelect: 0,
         strength: 0,
         spirit: 0,
      };

      this.engineEventCrator.asyncCeateEvent<AttributesUpdatedEvent>({
         type: CharacterEngineEvents.AttributesUpdated,
         characterId: event.character.id,
         attributes: this.stats[event.character.id],
      });
   };

   handleItemEquipped: EngineEventHandler<ItemEquippedEvent> = ({ event, services }) => {
      const attributes = {
         armor: 0,
         stamina: 0,
         agility: 0,
         intelect: 0,
         strength: 0,
         spirit: 0,
      };

      const equipment = services.equipmentService.getCharacterEquipment(event.characterId);

      forEach(equipment, (itemId) => {
         if (itemId) {
            const item = services.itemService.getItemById(itemId);
            const itemTemplate = services.itemTemplateService.getData()[item.itemTemplateId] as EquipmentItemTemplate;

            forEach(attributes, (_, attr) => {
               if (itemTemplate[attr]) {
                  attributes[attr] += itemTemplate[attr];
               }
            });
         }
      });

      this.stats[event.characterId] = attributes;

      this.engineEventCrator.asyncCeateEvent<AttributesUpdatedEvent>({
         type: CharacterEngineEvents.AttributesUpdated,
         characterId: event.characterId,
         attributes: this.stats[event.characterId],
      });
   };
}
