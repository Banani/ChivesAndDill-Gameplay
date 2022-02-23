import { EventParser } from '../../../EventParser';
import type { Npc } from '../types';
import * as _ from 'lodash';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { NpcTemplates } from '../NpcTemplate';
import { CharacterEngineEvents, CreateCharacterEvent } from '../../CharacterModule/Events';
import { CharacterType } from '../../../types';
import { NpcRespawns } from '../NpcRespawns';
import { NewNpcCreatedEvent, NpcEngineEvents } from '../Events';

export class NpcService extends EventParser {
   npcs: Record<string, Npc> = {};
   increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {};
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);

      _.map(NpcRespawns, (npcRespawn) => {
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
}
