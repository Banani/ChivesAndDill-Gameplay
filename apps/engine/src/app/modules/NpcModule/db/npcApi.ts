import * as _ from 'lodash';
import { DbApi } from '../../../services';
import { CharacterRespawn, WalkingType } from '../../../types/CharacterRespawn';

const BLOCK_SIZE = 32;

export interface NpcTemplateDb {
    _id: string;
    name: string;
    healthPoints: number;
    healthPointsRegeneration: number;
    spellPower: number;
    spellPowerRegeneration: number;
    movementSpeed: number;
    stock: any;
    quests: any;
    quotesEvents: any;
    npcRespawns: {
        _id: string;
        location: {
            x: number;
            y: number;
        },
        time: number;
        walkingType: WalkingType
    }[]
}

export class NpcApi extends DbApi {
    fetchNpcTemplates: () => Promise<Record<string, NpcTemplateDb>> = async () => {
        const collection = this.db.collection('npcTemplates');
        const data = await collection.find().toArray();

        return _.chain(data)
            .keyBy('_id')
            .value() as unknown as Record<string, NpcTemplateDb>;
    };

    fetchNpcRespawns: () => Promise<Record<string, CharacterRespawn>> = async () => {
        const collection = this.db.collection('npcTemplates');
        const data = await collection.find().toArray();
        const npcRespawns = {};

        for (let npcTemplate of data) {
            if (!npcTemplate.npcRespawns) {
                continue;
            }

            for (let respawn of npcTemplate.npcRespawns) {
                npcRespawns[respawn._id] = {
                    id: respawn._id,
                    npcTemplateId: npcTemplate._id.toString(),
                    location: { x: respawn.location.x * BLOCK_SIZE, y: respawn.location.y * BLOCK_SIZE },
                    time: respawn.time,
                    walkingType: respawn.walkingType
                }
            }
        }

        return npcRespawns;
    };

    watchForMapDefinition = (onChange) => {
        const collection = this.db.collection('mapFields');
        let changeStream = collection.watch();

        changeStream.on("change", (changeEvent) => onChange(changeEvent));
    }
}
