import * as _ from 'lodash';
import { DbApi } from '../../../services';
import { WalkingType } from '../../../types/CharacterRespawn';

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


    watchForNpcTemplates = (onChange) => {
        const collection = this.db.collection('npcTemplates');
        let changeStream = collection.watch([], { fullDocument: "updateLookup" });

        changeStream.on("change", (changeEvent) => onChange(changeEvent));
    }
}
