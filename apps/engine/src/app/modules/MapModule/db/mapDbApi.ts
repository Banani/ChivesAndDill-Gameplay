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

   fetchMapSchema: () => Promise<MapSchema> = async () => {
      const client = new MongoClient(URI, { serverApi: ServerApiVersion.v1 });
      const collection = client.db(dbConfig.database).collection('sprites');

      const data = await collection.find().toArray();

      client.close();

      return _.chain(data)
         .keyBy((el) => `ObjectID(\"${el._id}\")`)
         .mapValues((el) => ({
            location: {
               x: el.x * BLOCK_SIZE,
               y: el.y * BLOCK_SIZE,
            },
            path: '../assets/spritesheets/mapTextures/' + el.spriteSheet,
         }))
         .value();
   };
}
