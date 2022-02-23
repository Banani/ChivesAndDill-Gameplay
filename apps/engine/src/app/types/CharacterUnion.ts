import { Monster } from '../modules/MonsterModule/types';
import { Npc } from '../modules/NpcModule/types';
import { PlayerCharacter } from './PlayerCharacter';

export type CharacterUnion = PlayerCharacter | Monster | Npc;
