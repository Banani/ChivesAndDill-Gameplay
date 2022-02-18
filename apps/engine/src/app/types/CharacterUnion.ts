import { Monster } from '../modules/MonsterModule/types';
import { PlayerCharacter } from './PlayerCharacter';

export type CharacterUnion = PlayerCharacter | Monster;
