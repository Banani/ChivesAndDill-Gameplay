import { forEach } from 'lodash';
import { Engine } from '../Engine';
import { EngineEvents } from '../EngineEvents';
import { UpdatePathEvent } from '../types';

export class PathFinderEngine extends Engine {
   doAction() {
      forEach(this.services.pathFinderService.getActivePaths(), (path) => {
         const allCharacters = { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() };
         const seekerLocation = allCharacters[path.pathSeekerId].location;
         const targetLocation = allCharacters[path.targetId].location;

         this.eventCrator.createEvent<UpdatePathEvent>({
            type: EngineEvents.UpdatePath,
            pathSeekerId: path.pathSeekerId,
            points: [targetLocation],
         });
      });
   }
}
