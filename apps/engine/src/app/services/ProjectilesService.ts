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
      [EngineEvents.RemoveProjectile]: this.handleRemoveProjectile,
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
    const projectile = {
      ...event.spellData,
      startLocation: character.location,
      currentLocation: character.location,
    };
    this.projectiles[this.increment] = {
      ...projectile,
      ...this.projectileEngine.calculateAngles(projectile),
    };

    this.engineEventCrator.createEvent({
      type: EngineEvents.ProjectileCreated,
      projectileId: this.increment,
      currentLocation: character.location,
      spell: event.spellData.spell.name,
    });
  };

  handleProjectileMoved = ({ event, services }) => {
    this.projectiles[event.projectileId] = {
      ...this.projectiles[event.projectileId],
      currentLocation: event.newLocation,
    };
  };

  handleRemoveProjectile = ({ event, services }) => {
    delete this.projectiles[event.projectileId];

    this.engineEventCrator.createEvent({
      type: EngineEvents.ProjectileRemoved,
      projectileId: event.projectileId,
    });
  };

  getAllProjectiles = () => this.projectiles;
}
