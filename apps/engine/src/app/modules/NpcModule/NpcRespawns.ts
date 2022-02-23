import { CharacterRespawn, WalkingType } from '../../types/CharacterRespawn';
import { NpcTemplate, NpcTemplates } from './NpcTemplate';

export const NpcRespawns: Record<string, CharacterRespawn<NpcTemplate>> = {
   Manczur: {
      id: 'Manczur',
      location: { x: 300, y: 200 },
      characterTemplate: NpcTemplates['Manczur'],
      time: 20000,
      walkingType: WalkingType.None,
   },
   Roberto: {
      id: 'Roberto',
      location: { x: 450, y: 200 },
      characterTemplate: NpcTemplates['Roberto'],
      time: 20000,
      walkingType: WalkingType.None,
   },
};
