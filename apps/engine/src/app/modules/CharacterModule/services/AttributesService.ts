import { Attributes, EquipmentItemTemplate } from '@bananos/types';
import { forEach } from 'lodash';
import { EventParser } from '../../../EventParser';
import type { EngineEventHandler } from '../../../types';
import { Services } from '../../../types/Services';
import { ItemEngineEvents, ItemEquippedEvent, ItemStrippedEvent } from '../../ItemModule/Events';
import { AttributesUpdatedEvent, CharacterEngineEvents, NewCharacterCreatedEvent } from '../Events';

export class AttributesService extends EventParser {
   stats: Record<string, Attributes> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
         [ItemEngineEvents.ItemEquipped]: this.handleItemEquipped,
         [ItemEngineEvents.ItemStripped]: this.handleItemStripped,
      };
   }

   handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
      this.stats[event.character.id] = {
         armor: 0,
         stamina: 20,
         agility: 20,
         intelect: 20,
         strength: 20,
         spirit: 20,
      };

      this.engineEventCrator.asyncCeateEvent<AttributesUpdatedEvent>({
         type: CharacterEngineEvents.AttributesUpdated,
         characterId: event.character.id,
         attributes: this.stats[event.character.id],
      });
   };

   handleItemStripped: EngineEventHandler<ItemStrippedEvent> = ({ event, services }) => {
      this.recalculateAttributes(event.characterId, services);
   };

   handleItemEquipped: EngineEventHandler<ItemEquippedEvent> = ({ event, services }) => {
      this.recalculateAttributes(event.characterId, services);
   };

   recalculateAttributes = (characterId: string, services: Services) => {
      const attributes = {
         armor: 20,
         stamina: 20,
         agility: 0,
         intelect: 0,
         strength: 20,
         spirit: 20,
      };

      const equipment = services.equipmentService.getCharacterEquipment(characterId);

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

      this.stats[characterId] = attributes;

      this.engineEventCrator.asyncCeateEvent<AttributesUpdatedEvent>({
         type: CharacterEngineEvents.AttributesUpdated,
         characterId: characterId,
         attributes: this.stats[characterId],
      });
   };

   getAllStats = () => this.stats;
}
