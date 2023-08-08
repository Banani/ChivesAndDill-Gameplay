import { CharacterRespawn, WalkingType } from '../../types/CharacterRespawn';
import { NpcTemplates } from './NpcTemplate';

export const NpcRespawns: Record<string, CharacterRespawn> = {
    Manczur: {
        id: 'Manczur',
        location: { x: 300, y: 200 },
        templateId: NpcTemplates['Manczur'].id,
        time: 20000,
        walkingType: WalkingType.None,
    },
    KretonPL: {
        id: 'KretonPL',
        location: { x: 450, y: 200 },
        templateId: NpcTemplates['KretonPL'].id,
        time: 20000,
        walkingType: WalkingType.None,
    },
};
