import { ClientMessages, EngineEventType, GlobalStoreModule } from '@bananos/types';
import { cloneDeep } from 'lodash';
import { EventParser } from '../../../EventParser';
import type { MulticastPackage, Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { CreateCharacterEvent, CharacterEngineEvents } from '../../CharacterModule/Events';
import { PlayerTriesToCastASpellEvent, SpellEngineEvents } from '../../SpellModule/Events';
import { CreatePlayerCharacterEvent, NewPlayerCreatedEvent, PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../Events';

const emptyMulticastPackage: MulticastPackage = { key: GlobalStoreModule.PLAYER, messages: {} };

export class PlayerNotifier extends EventParser implements Notifier {
   multicast: MulticastPackage = cloneDeep(emptyMulticastPackage);

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   getMulticast = () => {
      const tempMulticast = this.multicast;
      this.multicast = cloneDeep(emptyMulticastPackage);
      return tempMulticast;
   };

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
      const currentSocket = services.socketConnectionService.getSocketById(event.playerId);

      currentSocket.on(ClientMessages.CreateCharacter, (character) => {
         this.engineEventCrator.asyncCeateEvent<CreatePlayerCharacterEvent>({
            type: PlayerEngineEvents.CreatePlayerCharacter,
            playerOwnerId: event.playerId,
            name: character.name,
            class: character.class,
         });
      });

      if (!this.multicast.messages[event.playerId]) {
         this.multicast.messages[event.playerId] = { events: [], data: {}, toDelete: [] };
      }

      this.multicast.messages[event.playerId].events.push({
         type: EngineEventType.PlayerCreated,
      });
   };

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

      currentSocket.on(ClientMessages.PerformBasicAttack, ({ directionLocation, spellName }) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToCastASpellEvent>({
            type: SpellEngineEvents.PlayerTriesToCastASpell,
            spellData: {
               characterId: event.playerCharacter.id,
               spellName,
               directionLocation,
            },
         });
      });
   };
}
