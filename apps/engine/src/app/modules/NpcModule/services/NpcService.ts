import * as _ from 'lodash';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { CharacterType } from '../../../types';
import { Services } from '../../../types/Services';
import { CharacterEngineEvents, CreateCharacterEvent } from '../../CharacterModule/Events';
import { NewNpcCreatedEvent, NpcEngineEvents } from '../Events';
import type { Npc } from '../types';

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
            isDead: false,
            respawnId: npcRespawn.id,
            templateId: npcRespawn.characterTemplate.id,
            id,
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
