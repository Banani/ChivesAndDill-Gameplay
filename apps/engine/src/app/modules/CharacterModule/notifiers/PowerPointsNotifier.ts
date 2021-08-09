import { PowerPointsTrack } from '@bananos/types';
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

      this.powerPointsTrack = {};

      return { data: powerPointsTrack, key: 'characterPowerPoints', toDelete: [] };
   };

   handleNewPowerTrackCreated: EngineEventHandler<NewPowerTrackCreatedEvent> = ({ event, services }) => {
      // BUG - should goes only to new player
      this.powerPointsTrack = services.powerPointsService.getAllPowerTracks();
   };

   handleCharacterLostHp: EngineEventHandler<CharacterLostHpEvent> = ({ event }) => {
      this.powerPointsTrack[event.characterId] = {
         ...this.powerPointsTrack[event.characterId],
         currentHp: event.currentHp,
      };
   };

   handleCharacterGotHp: EngineEventHandler<CharacterGotHpEvent> = ({ event }) => {
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
