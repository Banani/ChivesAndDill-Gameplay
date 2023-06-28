import { MapDefinition, MapSchema } from '@bananos/types';
import * as _ from 'lodash';
import { DbApi } from '../../../services';

const BLOCK_SIZE = 32;

export class MapDbApi extends DbApi {
    fetchMapDefinition: () => Promise<MapDefinition> = async () => {
        const collection = this.db.collection('mapFields');
        const data = await collection.find().toArray();

        return _.chain(data)
            .keyBy('_id')
            .mapValues((mapField) => [mapField.spriteId])
            .value();
    };

    watchForMapDefinition = (onChange) => {
        const collection = this.db.collection('mapFields');
        let changeStream = collection.watch();

        changeStream.on("change", (changeEvent) => onChange(changeEvent));
    }

    fetchMapSchema: () => Promise<MapSchema> = async () => {
        const collection = this.db.collection('sprites');
        const data = await collection.find().toArray();

        return _.chain(data)
            .keyBy('_id')
            .mapValues((el) => ({
                location: {
                    x: el.x * BLOCK_SIZE,
                    y: el.y * BLOCK_SIZE,
                },
                path: "http://localhost:3000/photo?path=" + el.spriteSheet,
            }))
            .value();
    };
}
