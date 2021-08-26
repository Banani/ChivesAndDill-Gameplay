import { MonsterRespawns } from './../../MonsterModule/MonsterRespawns';
import type { NewMonsterCreatedEvent } from './../../MonsterModule/Events';
import { MonsterEngineEvents } from './../../MonsterModule/Events';
import type { EnginePackageEvent, PowerPointsTrack } from '@bananos/types';
import { EngineEventType, GlobalStoreModule } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import type { Notifier } from '../../../Notifier';
import type { CharacterDiedEvent, EngineEventHandler } from '../../../types';
import type {
   CharacterGotHpEvent,
   CharacterGotSpellPowerEvent,
   CharacterLostHpEvent,
   CharacterLostSpellPowerEvent,
   NewPowerTrackCreatedEvent} from '../Events';
import {
   CharacterEngineEvents
} from '../Events';

export class PowerPointsNotifier extends EventParser implements Notifier {
   private powerPointsTrack: Record<string, Partial<PowerPointsTrack>> = {};
   private events: EnginePackageEvent[] = [];
   private toDelete: string[] = [];

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.CharacterLostHp]: this.handleCharacterLostHp,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [CharacterEngineEvents.CharacterGotHp]: this.handleCharacterGotHp,
         [CharacterEngineEvents.CharacterLostSpellPower]: this.handleCharacterLostSpellPower,
         [CharacterEngineEvents.CharacterGotSpellPower]: this.handleCharacterGotSpellPower,
         [CharacterEngineEvents.NewPowerTrackCreated]: this.handleNewPowerTrackCreated,
         [MonsterEngineEvents.NewMonsterCreated]: this.handleNewMonsterCreated
      };
   }

   getBroadcast = () => {
      const powerPointsTrack = this.powerPointsTrack;
      const toDelete = this.toDelete;
      const events = this.events;

      this.powerPointsTrack = {};
      this.toDelete = [];
      this.events = [];

      return { data: powerPointsTrack, key: GlobalStoreModule.CHARACTER_POWER_POINTS, toDelete, events };
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      this.toDelete.push(event.characterId);
      delete this.powerPointsTrack[event.characterId];
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
      this.events.push({
         type: EngineEventType.CharacterGotHp,
         characterId: event.characterId,
         amount: event.amount,
         source: event.source,
      });

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

   handleNewMonsterCreated: EngineEventHandler<NewMonsterCreatedEvent> = ({ event }) => {
      const template = MonsterRespawns[event.monster.respawnId].monsterTemplate;
      
      this.powerPointsTrack[event.monster.id] = {
         maxHp: template.healthPoints,
         currentHp: template.healthPoints,
         currentSpellPower: template.spellPower,
         maxSpellPower: template.spellPower
      };
   }
}
