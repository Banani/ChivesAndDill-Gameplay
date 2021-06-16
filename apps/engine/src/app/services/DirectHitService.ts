import { EngineEvents } from '../EngineEvents';
import type { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';
import { distanceBetweenTwoPoints } from '../math/lines';
import { SpellType } from '../SpellType';
import _ from 'lodash';

export class DirectHitService extends EventParser {

  constructor() {
    super();
    this.eventsToHandlersMap = {
      [EngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
    };
  }

  init(engineEventCrator: EngineEventCrator, services) {
    super.init(engineEventCrator);
  }

  handlePlayerCastedSpell = ({ event, services }) => {
    if (event.spellData.spell.type === SpellType.DIRECT_HIT) {
      const character = services.characterService.getCharacterById(event.spellData.characterId);
      if (distanceBetweenTwoPoints(character.location, event.spellData.directionLocation) > event.spellData.spell.range) {
        return;
      }
      
      const allCharacters = services.characterService.getAllCharacters();
      for (const i in _.omit(allCharacters, [character.id])){
          if (distanceBetweenTwoPoints(event.spellData.directionLocation, allCharacters[i].location) < allCharacters[i].size/2){
            this.engineEventCrator.createEvent({
              type: EngineEvents.CharacterHit,
              spell: event.spellData.spell,
              target: allCharacters[i],
            });
            break;
          }
      }
   }
  };

}
