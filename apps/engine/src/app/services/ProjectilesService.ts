import { EngineEvents } from '../EngineEvents';
import { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';

export class ProjectilesService extends EventParser {
  projectileEngine: any;
  projectiles = {};
  increment = 0;

  constructor(projectileEngine) {
    super();
    this.projectileEngine = projectileEngine;
    this.eventsToHandlersMap = {
      [EngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
      [EngineEvents.ProjectileMoved]: this.handleProjectileMoved,
    };
  }

  init(engineEventCrator: EngineEventCrator, services) {
    super.init(engineEventCrator);
    this.projectileEngine.init(services);
  }

  handlePlayerCastedSpell = ({ event, services }) => {
    const character = services.characterService.getCharacterById(
      event.spellData.characterId
    );
    this.increment++;
    this.projectiles[this.increment] = {
      ...event.spellData,
      startLocation: character.location,
      currentLocation: character.location,
    };

    this.engineEventCrator.createEvent({
      type: EngineEvents.ProjectileCreated,
      projectileId: this.increment,
      spell: event.spellData.spell.name,
    });
  };

  handleProjectileMoved = ({ event, services }) => {
    this.projectiles[event.projectileId] = {
      ...this.projectiles[event.projectileId],
      currentLocation: event.newLocation,
    };
  };

  getAllProjectiles = () => this.projectiles;
}
