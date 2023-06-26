import { MapDefinition, MapSchema } from '@bananos/types';
import { dbConfig } from 'apps/engine/database';
import * as _ from 'lodash';
import { MongoClient, ServerApiVersion } from 'mongodb';

const BLOCK_SIZE = 32;

const URI = `mongodb+srv://${dbConfig.userName}:${dbConfig.password}@cluster0.bmgp9.mongodb.net/?retryWrites=true&w=majority`;

export class MapDbApi {
    fetchMapDefinition: () => Promise<MapDefinition> = async () => {
        const client = new MongoClient(URI, { serverApi: ServerApiVersion.v1 });
        const collection = client.db(dbConfig.database).collection('mapFields');

        const data = await collection.find().toArray();

        client.close();

        return _.chain(data)
            .keyBy('_id')
            .mapValues((mapField) => [mapField.spriteId])
            .value();
    };

    watchForMapDefinition = (onChange) => {
        const client = new MongoClient(URI, { serverApi: ServerApiVersion.v1 });
        const collection = client.db(dbConfig.database).collection('mapFields');

        let changeStream = collection.watch();

        changeStream.on("change", (changeEvent) => onChange(changeEvent));
    }

    fetchMapSchema: () => Promise<MapSchema> = async () => {
        const client = new MongoClient(URI, { serverApi: ServerApiVersion.v1 });
        const collection = client.db(dbConfig.database).collection('sprites');

        const data = await collection.find().toArray();

        client.close();

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
