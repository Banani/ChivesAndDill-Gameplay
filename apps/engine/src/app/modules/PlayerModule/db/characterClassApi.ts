import { CharacterClass } from '@bananos/types';
import * as _ from 'lodash';
import { DbApi } from '../../../services';

export class CharacterClassApi extends DbApi {
    fetchCharacterClasses: () => Promise<Record<string, CharacterClass>> = async () => {
        const collection = this.db.collection('characterClasses');
        const data = await collection.find().toArray();

        return _.chain(data)
            .keyBy('_id')
            .mapValues(characterClass => ({
                id: characterClass._id.toString(),
                ..._.omit(characterClass, '_id')
            }))
            .value() as unknown as Record<string, CharacterClass>;
    };

    watchForCharacterClasses = (onChange) => {
        const collection = this.db.collection('characterClasses');
        let changeStream = collection.watch([], { fullDocument: "updateLookup" });

        changeStream.on("change", (changeEvent) => onChange(changeEvent));
    }
}
