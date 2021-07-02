import { PlayerMovementNotifier, ProjectileNotifier, CharacterEffectNotifier } from '../notifiers';
import { CharactersService, PlayerMovementService, ProjectilesService, DirectHitService, CooldownService, SocketConnectionService } from '../services';

export interface Services {
   characterService: CharactersService;
   playerMovementService: PlayerMovementService;
   projectilesService: ProjectilesService;
   directHitService: DirectHitService;
   playerMovementNotifier: PlayerMovementNotifier;
   projectileNotifier: ProjectileNotifier;
   characterEffectNotifier: CharacterEffectNotifier;
   cooldownService: CooldownService;
   socketConnectionService: SocketConnectionService;
}
