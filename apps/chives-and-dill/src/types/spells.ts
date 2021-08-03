import type { Spell, Projectile, Location, ActiveSpellCast } from '@bananos/types';

export interface SpellsState {
   projectiles: Record<string, Projectile>;
   spells: Record<string, Spell>;
   keyBinding: Record<string, string>;
   areaSpellsEffects: Record<string, AreaSpellEffectCreatedPayload>;
   activeSpellsCasts: Record<string, ActiveSpellCast>;
   spellShapesToDisplay: any[];
   lastSpellLandTimestamp: number;
}

export interface SpellShapesToDisplay {
   angle: number;
   castLocation: Location;
   directionLocation: Location;
   spell: Spell;
}

export interface SpellsAwareState {
   spellsModule: SpellsState;
}

export interface InitializeSpellsPayload {
   projectiles: Record<string, Projectile>;
   spells: Record<string, Spell>;
}

export interface AddProjectilePayload {
   angle: number;
   currentLocation: Location;
   projectileId: string;
   spell: string;
}

export interface UpdateProjectilePayload {
   projectileId: string;
   angle: number;
   newLocation: Location;
}

export interface DeleteProjectilePayload {
   projectileId: string;
}

export interface AreaSpellEffectCreatedPayload {
   event: {
      areaSpellEffectId: string;
      effect: {
         type: string;
         attackFrequency: number;
         areaType: string;
         radius: number;
         period: number;
         spellEffects: Record<string, SpellEffects>[];
      };
      location: Location;
   };
}

export interface SpellEffects {
   type: string;
   amount: number;
}

export interface AreaSpellEffectRemovedPayload {
   event: {
      areaSpellEffectId: string;
   };
}

export interface ActiveSpellCastPayload {
   event: {
      casterId: number;
      spell: Spell;
   };
}

export interface DeleteSpellCastPayload {
   event: {
      channelId: number;
   };
}
