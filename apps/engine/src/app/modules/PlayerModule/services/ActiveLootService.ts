import { EventParser } from '../../../EventParser';
import { EngineEventHandler, PlayerMovedEvent } from '../../../types';
import { CloseLootEvent, LootClosedEvent, LootOpenedEvent, PlayerEngineEvents, PlayerTriesToOpenLootEvent } from '../Events';
import * as _ from 'lodash';
import { EngineEvents } from '../../../EngineEvents';

export class ActiveLootService extends EventParser {
   // character_id => corpse_id
   activeLoots: Record<string, string> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerTriesToOpenLoot]: this.handlePlayerTriesToOpenLoot,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [PlayerEngineEvents.CloseLoot]: this.handleCloseLoot,
      };
   }

   handlePlayerTriesToOpenLoot: EngineEventHandler<PlayerTriesToOpenLootEvent> = ({ event, services }) => {
      // check distance and if it exists
      this.activeLoots[event.characterId] = event.corpseId;
      const items = services.corpseDropService.getCorpseDropTrackById(event.corpseId);

      if (items) {
         this.engineEventCrator.asyncCeateEvent<LootOpenedEvent>({
            type: PlayerEngineEvents.LootOpened,
            characterId: event.characterId,
            corpseId: event.corpseId,
            items,
         });
      }
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
      this.closeLoot(event.characterId);
   };

   handleCloseLoot: EngineEventHandler<CloseLootEvent> = ({ event }) => {
      this.closeLoot(event.characterId);
   };

   closeLoot = (characterId: string) => {
      delete this.activeLoots[characterId];

      this.engineEventCrator.asyncCeateEvent<LootClosedEvent>({
         type: PlayerEngineEvents.LootClosed,
         characterId,
      });
   };
}
