import { EngineEventType, EnginePackageEvent, GlobalStoreModule, PowerPointsTrack } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import type { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import {
   CharacterEngineEvents,
   CharacterGotHpEvent,
   CharacterGotSpellPowerEvent,
   CharacterLostHpEvent,
   CharacterLostSpellPowerEvent,
   NewPowerTrackCreatedEvent,
} from '../Events';

export class PowerPointsNotifier extends EventParser implements Notifier {
   private powerPointsTrack: Record<string, Partial<PowerPointsTrack>> = {};
   private events: EnginePackageEvent[] = [];
   private increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.CharacterLostHp]: this.handleCharacterLostHp,
         [CharacterEngineEvents.CharacterGotHp]: this.handleCharacterGotHp,
         [CharacterEngineEvents.CharacterLostSpellPower]: this.handleCharacterLostSpellPower,
         [CharacterEngineEvents.CharacterGotSpellPower]: this.handleCharacterGotSpellPower,
         [CharacterEngineEvents.NewPowerTrackCreated]: this.handleNewPowerTrackCreated,
      };
   }

   getBroadcast = () => {
      const powerPointsTrack = this.powerPointsTrack;
      const events = this.events;

      this.powerPointsTrack = {};
      this.events = [];

      return { data: powerPointsTrack, key: GlobalStoreModule.CHARACTER_POWER_POINTS, toDelete: [], events };
   };

   handleNewPowerTrackCreated: EngineEventHandler<NewPowerTrackCreatedEvent> = ({ event, services }) => {
      // BUG - should goes only to new player
      this.powerPointsTrack = services.powerPointsService.getAllPowerTracks();
   };

   handleCharacterLostHp: EngineEventHandler<CharacterLostHpEvent> = ({ event }) => {
      this.events.push({
         type: EngineEventType.CharacterLostHp,
         characterId: event.characterId,
         amount: event.amount,
      });

      this.powerPointsTrack[event.characterId] = {
         ...this.powerPointsTrack[event.characterId],
         currentHp: event.currentHp,
      };
   };

   handleCharacterGotHp: EngineEventHandler<CharacterGotHpEvent> = ({ event }) => {
      this.increment++;
      this.events[`spellEvent_${this.increment}`] = {
         type: EngineEventType.CharacterGotHp,
         characterId: event.characterId,
         amount: event.amount,
         source: event.source,
      };

      this.powerPointsTrack[event.characterId] = {
         ...this.powerPointsTrack[event.characterId],
         currentHp: event.currentHp,
      };
   };

   handleCharacterLostSpellPower: EngineEventHandler<CharacterLostSpellPowerEvent> = ({ event }) => {
      this.powerPointsTrack[event.characterId] = {
         ...this.powerPointsTrack[event.characterId],
         currentSpellPower: event.currentSpellPower,
      };
   };

   handleCharacterGotSpellPower: EngineEventHandler<CharacterGotSpellPowerEvent> = ({ event }) => {
      this.powerPointsTrack[event.characterId] = {
         ...this.powerPointsTrack[event.characterId],
         currentSpellPower: event.currentSpellPower,
      };
   };
}
