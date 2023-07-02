import { ItemTemplate } from '@bananos/types';
import * as _ from 'lodash';
import { DbApi } from '../../../services';

export class ItemApi extends DbApi {
    fetchItemTemplates: () => Promise<Record<string, ItemTemplate>> = async () => {
        const collection = this.db.collection('itemTemplates');
        const data = await collection.find().toArray();

        return _.chain(data)
            .keyBy('_id')
            .mapValues(itemTemplate => ({
                id: itemTemplate._id.toString(),
                ..._.omit(itemTemplate, '_id')
            }))
            .value() as unknown as Record<string, ItemTemplate>;
    };

    // watchForNpcTemplates = (onChange) => {
    //     const collection = this.db.collection('npcTemplates');
    //     let changeStream = collection.watch([], { fullDocument: "updateLookup" });

    //     changeStream.on("change", (changeEvent) => onChange(changeEvent));
    // }
}
