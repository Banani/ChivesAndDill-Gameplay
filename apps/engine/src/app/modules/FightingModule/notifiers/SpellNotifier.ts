import { FightingEngineMessages } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler, SpellChannelingFinishedEvent, SpellChannelingInterruptedEvent } from '../../../types';
import { AreaSpellEffectCreatedEvent, AreaSpellEffectRemovedEvent, FightingEngineEvents, SpellLandedEvent } from '../Events';

export class SpellNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [FightingEngineEvents.SpellLanded]: this.handleSpellLanded,
         [FightingEngineEvents.AreaSpellEffectCreated]: this.handleAreaSpellEffectCreated,
         [FightingEngineEvents.AreaSpellEffectRemoved]: this.handleAreaSpellEffectRemoved,
         [EngineEvents.SpellChannelingFinished]: this.handleSpellChannelingFinished,
         [EngineEvents.SpellChannelingInterrupted]: this.handleSpellChannelingInterrupted,
      };
   }

   handleSpellLanded: EngineEventHandler<SpellLandedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.SpellLanded, {
         spellName: event.spell.name,
         angle: event.angle,
         castLocation: event.caster.location,
         directionLocation: event.location,
      });
   };

   handleAreaSpellEffectCreated: EngineEventHandler<AreaSpellEffectCreatedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.AreaSpellEffectCreated, {
         location: event.location,
         areaSpellEffectId: event.areaSpellEffectId,
         effect: event.effect,
      });
   };

   handleAreaSpellEffectRemoved: EngineEventHandler<AreaSpellEffectRemovedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.AreaSpellEffectRemoved, {
         areaSpellEffectId: event.areaSpellEffectId,
      });
   };

   handleSpellChannelingFinished: EngineEventHandler<SpellChannelingFinishedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.ChannelingFinished, {
         channelId: event.channelId,
      });
   };

   handleSpellChannelingInterrupted: EngineEventHandler<SpellChannelingInterruptedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.ChannelingInterrupted, {
         channelId: event.channelId,
      });
   };
}
