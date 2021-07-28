import { FightingEngineMessages } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler, PlayerCastedSpellEvent, SpellChannelingFinishedEvent, SpellChannelingInterruptedEvent } from '../../../types';
import {
   AbsorbShieldValueChangedEvent,
   AreaSpellEffectCreatedEvent,
   AreaSpellEffectRemovedEvent,
   CharacterGainPowerStackEvent,
   CharacterLosePowerStackEvent,
   DamageAbsorbedEvent,
   FightingEngineEvents,
   SpellLandedEvent,
   SubSpellCastedEvent,
} from '../Events';

export class SpellNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [FightingEngineEvents.SpellLanded]: this.handleSpellLanded,
         [FightingEngineEvents.AreaSpellEffectCreated]: this.handleAreaSpellEffectCreated,
         [FightingEngineEvents.AreaSpellEffectRemoved]: this.handleAreaSpellEffectRemoved,
         [EngineEvents.SpellChannelingFinished]: this.handleSpellChannelingFinished,
         [EngineEvents.SpellChannelingInterrupted]: this.handleSpellChannelingInterrupted,
         [EngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
         [FightingEngineEvents.SubSpellCasted]: this.handleSubSpellCasted,
         [FightingEngineEvents.CharacterGainPowerStack]: this.handleCharacterGainPowerStack,
         [FightingEngineEvents.CharacterLosePowerStack]: this.handleCharacterLosePowerStack,
         [FightingEngineEvents.DamageAbsorbed]: this.handleDamageAbsorbed,
         [FightingEngineEvents.AbsorbShieldValueChanged]: this.handleAbsorbShieldValueChanged,
      };
   }

   handleSpellLanded: EngineEventHandler<SpellLandedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.SpellLanded, {
         spellName: event.spell.name,
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

   handleDamageAbsorbed: EngineEventHandler<DamageAbsorbedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.DamageAbsorbed, {
         targetId: event.targetId,
      });
   };

   handleAbsorbShieldValueChanged: EngineEventHandler<AbsorbShieldValueChangedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(FightingEngineMessages.AbsorbShieldChanged, {
         targetId: event.ownerId,
         newValue: event.newValue,
      });
   };
}
