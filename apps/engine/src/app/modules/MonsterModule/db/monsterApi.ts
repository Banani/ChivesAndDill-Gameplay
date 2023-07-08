import * as _ from 'lodash';
import { DbApi } from '../../../services';
import { WalkingType } from '../../../types/CharacterRespawn';

export interface MonsterTemplateDb {
    _id: string;
    name: string;
    healthPoints: number;
    healthPointsRegeneration: number;
    spellPower: number;
    spellPowerRegeneration: number;
    movementSpeed: number;
    sightRange: number;
    desiredRange: number;
    escapeRange: number;
    attackFrequency: number;

    spells: any;
    dropSchema: any;
    quotesEvents: any;
    monsterRespawns: {
        id: string;
        location: {
            x: number;
            y: number;
        },
        time: number;
        walkingType: WalkingType
    }[]
}

export class MonsterApi extends DbApi {
    fetchMonsterTemplates: () => Promise<Record<string, MonsterTemplateDb>> = async () => {
        const collection = this.db.collection('monsterTemplates');
        const data = await collection.find().toArray();

        return _.chain(data)
            .keyBy('_id')
            .value() as unknown as Record<string, MonsterTemplateDb>;
    };


    watchForMonsterTemplates = (onChange) => {
        const collection = this.db.collection('monsterTemplates');
        let changeStream = collection.watch([], { fullDocument: "updateLookup" });

        changeStream.on("change", (changeEvent) => onChange(changeEvent));
    }
}
