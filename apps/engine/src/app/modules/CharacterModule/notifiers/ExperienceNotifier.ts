import { EngineEventType, ExperienceExternalTrack, GlobalStoreModule } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import type { CharacterGainExperienceEvent, CharacterLevelChangedEvent, ExperienceTrackCreatedEvent, ExperienceTrackRemovedEvent } from '../Events';
import { CharacterEngineEvents } from '../Events';
import { ExperienceTable } from '../ExperienceTable';

export class ExperienceNotifier extends Notifier<Partial<ExperienceExternalTrack>> {
   constructor() {
      super({ key: GlobalStoreModule.EXPERIENCE });
      this.eventsToHandlersMap = {
         [CharacterEngineEvents.ExperienceTrackCreated]: this.handleExperienceTrackCreated,
         [CharacterEngineEvents.ExperienceTrackRemoved]: this.handleExperienceTrackRemoved,
         [CharacterEngineEvents.CharacterGainExperience]: this.handleCharacterGainExperience,
         [CharacterEngineEvents.CharacterLevelChanged]: this.handleCharacterLevelChanged,
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   handleExperienceTrackCreated: EngineEventHandler<ExperienceTrackCreatedEvent> = ({ event }) => {
      this.broadcastObjectsUpdate({
         objects: { [event.trackId]: { ...event.experienceTrack, toNextLevel: ExperienceTable[event.experienceTrack.level] } },
      });
   };

   handleExperienceTrackRemoved: EngineEventHandler<ExperienceTrackRemovedEvent> = ({ event }) => {
      this.broadcastObjectsDeletion({
         ids: [event.trackId],
      });
   };

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      this.multicastMultipleObjectsUpdate([
         {
            receiverId: event.playerCharacter.ownerId,
            objects: _.mapValues(services.experienceService.getExperienceTracks(), (experienceTrack) => ({
               level: experienceTrack.level,
            })),
         },
      ]);
   };

   handleCharacterLevelChanged: EngineEventHandler<CharacterLevelChangedEvent> = ({ event, services }) => {
      this.broadcastEvents({
         events: [
            {
               type: EngineEventType.LevelChanged,
               characterId: event.characterId,
               level: event.newLevel,
            },
         ],
      });
   };

   handleCharacterGainExperience: EngineEventHandler<CharacterGainExperienceEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type !== CharacterType.Player) {
         return;
      }

      this.multicastMultipleObjectsUpdate([
         {
            receiverId: character.ownerId,
            objects: {
               [event.characterId]: event.experienceTrack,
            },
         },
      ]);

      // TODO: multicastEvents
      this.broadcastEvents({
         events: [
            {
               type: EngineEventType.ExperienceGain,
               characterId: event.characterId,
               amount: event.amount,
            },
         ],
      });
   };
}
