import type { Player, Location, Spell, Projectile, SpriteSheet } from '@bananos/types';

export interface PlayersState {
  activePlayer: string;
  characters: Record<string, Player>;
  characterViewsSettings: Record<string, SpriteSheet>;
  areas: [][];
  projectiles: Record<string, Projectile>;
  spells: Record<string, Spell>;
  keyBinding: Record<string, string>;
}

export interface PlayersAwareState {
  playersModule: PlayersState;
}

export interface ChangeLocationPayload {
  selectedPlayerId: string;
  newLocation: Location;
  newDirection: number;
}

export interface ChangePlayerMovingStatusPayload {
  userId: string;
  isInMove: boolean;
}

export interface InitializePayload {
  activePlayer: string;
  characters: Record<string, Player>;
  areas: [][];
  projectiles: Record<string, Projectile>;
  spells: Record<string, Spell>;
}

export interface ChangeImagePayload {
  image: string[];
}

export interface AddPlayerPayload {
  player: Player;
}

export interface DeletePlayerPayload {
  userId: string;
}

export interface AddSpellPayload {
  projectileId: string,
  spell: Projectile,
  name: string,
  currentLocation: Location
}

export interface UpdateSpellPayload {
  projectileId: string,
  angle: number,
  newLocation: Location,
  name: string,
}

export interface DeleteProjectilePayload {
  projectileId: string,
}

export interface UpdateCharacterHpPayload {
  characterId: string,
  currentHp: number,
  amount: number,
}

export interface CharacterDiedPayload {
  characterId: string
}