import { Spell } from '@bananos/types';
import * as _ from 'lodash';
import { DbApi } from '../../../services';

export class SpellApi extends DbApi {
    fetchSpells: () => Promise<Record<string, Spell>> = async () => {
        const collection = this.db.collection('spells');
        const data = await collection.find().toArray();

        return _.chain(data)
            .keyBy('_id')
            .mapValues(spell => ({
                id: spell._id.toString(),
                ..._.omit(spell, '_id')
            }))
            .value() as unknown as Record<string, Spell>;
    };


    watchForSpells = (onChange) => {
        const collection = this.db.collection('spells');
        let changeStream = collection.watch([], { fullDocument: "updateLookup" });

        changeStream.on("change", (changeEvent) => onChange(changeEvent));
    }
}
