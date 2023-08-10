import { Character, CharacterType, Spell } from "@bananos/types";
import { omit, pickBy } from "lodash";

export const filterCharactersBaseOnSpellImpact = (allCharacters: Record<string, Character>, spell: Spell, casterId: string) => {
    allCharacters = pickBy(allCharacters, character => character.type !== CharacterType.Npc);

    if (!spell.monstersImpact) {
        allCharacters = pickBy(allCharacters, character => character.type !== CharacterType.Monster);
    }

    if (!spell.casterImpact) {
        allCharacters = omit(allCharacters, [casterId]);
    }

    if (!spell.playersImpact) {
        allCharacters = pickBy(allCharacters, character => character.type !== CharacterType.Player);
    }

    return allCharacters;
}