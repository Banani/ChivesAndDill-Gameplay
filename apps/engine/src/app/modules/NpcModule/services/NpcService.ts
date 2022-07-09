import { EventParser } from '../../../EventParser';
import type { Npc } from '../types';
import * as _ from 'lodash';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { CharacterEngineEvents, CreateCharacterEvent } from '../../CharacterModule/Events';
import { CharacterType } from '../../../types';
import { NewNpcCreatedEvent, NpcEngineEvents } from '../Events';
import { Services } from '../../../types/Services';

export class NpcService extends EventParser {
   npcs: Record<string, Npc> = {};
   increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {};
   }

   init(engineEventCrator: EngineEventCrator, services: Services) {
      super.init(engineEventCrator);

      _.map(services.npcRespawnTemplateService.getData(), (npcRespawn) => {
         this.increment++;
         const id = 'npc_' + this.increment;

         this.npcs[id] = {
            type: CharacterType.Npc,
            ...npcRespawn.characterTemplate,
            location: npcRespawn.location,
            templateId: npcRespawn.characterTemplate.id,
         };

         this.engineEventCrator.asyncCeateEvent<CreateCharacterEvent>({
            type: CharacterEngineEvents.CreateCharacter,
            character: this.npcs[id],
         });

         this.engineEventCrator.asyncCeateEvent<NewNpcCreatedEvent>({
            type: NpcEngineEvents.NewNpcCreated,
            npc: this.npcs[id],
         });
      });
   }

   getNpcById = (npcId: string) => this.npcs[npcId];
}
