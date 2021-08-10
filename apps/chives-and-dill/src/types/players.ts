import type { Player, Location, SpriteSheet } from '@bananos/types';

export interface PlayersState {
   activePlayer: string | null;
   characters: Record<string, Player>;
   characterViewsSettings: Record<string, SpriteSheet>;
   areas: [][];
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

export interface InitializePlayersPayload {
   activePlayer: string;
   characters: Record<string, Player>;
   areas: [][];
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

export interface UpdateCharacterHpPayload {
   characterId: string;
   currentHp: number;
   amount: number;
   spellEffect: string;
}

export interface UpdateCharacterSpellPowerPayload {
   characterId: string;
   currentSpellPower: number;
   amount: number;
}

export interface CharacterDiedPayload {
   characterId: string;
}

export interface UpdatePlayerAbsorbPayload {
   targetId: string,
   newValue: number,
}

export interface UpdatePlayerClassPayload {
   activePlayerId: string;
   class: string;
}
