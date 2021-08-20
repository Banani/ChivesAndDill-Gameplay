import { EngineEventType, FightingEngineMessages, GlobalStoreModule, SpellLandedEvent as SpellLandedPackegeEvent } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import {
   AreaSpellEffectCreatedEvent,
   AreaSpellEffectRemovedEvent,
   CharacterGainPowerStackEvent,
   CharacterLosePowerStackEvent,
   PlayerCastedSpellEvent,
   SpellChannelingFinishedEvent,
   SpellChannelingInterruptedEvent,
   SpellEngineEvents,
   SpellLandedEvent,
   SubSpellCastedEvent,
} from '../Events';

export class SpellNotifier extends EventParser implements Notifier {
   private events: SpellLandedPackegeEvent[] = [];

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.SpellLanded]: this.handleSpellLanded,
         [SpellEngineEvents.AreaSpellEffectCreated]: this.handleAreaSpellEffectCreated,
         [SpellEngineEvents.AreaSpellEffectRemoved]: this.handleAreaSpellEffectRemoved,
         [SpellEngineEvents.SpellChannelingFinished]: this.handleSpellChannelingFinished,
         [SpellEngineEvents.SpellChannelingInterrupted]: this.handleSpellChannelingInterrupted,
         [SpellEngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
         [SpellEngineEvents.SubSpellCasted]: this.handleSubSpellCasted,
         [SpellEngineEvents.CharacterGainPowerStack]: this.handleCharacterGainPowerStack,
         [SpellEngineEvents.CharacterLosePowerStack]: this.handleCharacterLosePowerStack,
      };
   }

   getBroadcast = () => {
      const events = this.events;

      this.events = [];

      return { data: [], key: GlobalStoreModule.SPELLS, toDelete: [], events };
   };

   handleSpellLanded: EngineEventHandler<SpellLandedEvent> = ({ event, services }) => {
      this.events.push({
         type: EngineEventType.SpellLanded,
         spell: event.spell,
         angle: event.angle,
         castLocation: event.caster.location,
         directionLocation: event.location,
      });

      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.SpellLanded, {
         spell: event.spell,
         angle: event.angle,
         castLocation: event.caster?.location,
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

   handlePlayerCastedSpell: EngineEventHandler<PlayerCastedSpellEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.SpellHasBeenCast, {
         spell: event.spell,
         casterId: event.casterId,
      });
   };

   handleSubSpellCasted: EngineEventHandler<SubSpellCastedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.SpellHasBeenCast, {
         spell: event.spell,
         casterId: event.casterId,
      });
   };

   handleCharacterGainPowerStack: EngineEventHandler<CharacterGainPowerStackEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.CharacterGainPowerStack, {
         characterId: event.characterId,
         powerStackType: event.powerStackType,
         currentAmount: event.currentAmount,
         amount: event.amount,
      });
   };

   handleCharacterLosePowerStack: EngineEventHandler<CharacterLosePowerStackEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.CharacterLosePowerStack, {
         characterId: event.characterId,
         powerStackType: event.powerStackType,
         currentAmount: event.currentAmount,
         amount: event.amount,
      });
   };
}
