import { dbConfig } from 'apps/engine/database';
import * as _ from 'lodash';
import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { EventParser } from '../EventParser';
const fs = require('fs');

const URI = `mongodb+srv://${dbConfig.userName}:${dbConfig.password}@cluster0.bmgp9.mongodb.net/?retryWrites=true&w=majority`;

export abstract class DbApi {
    db: Db;

    constructor(db: Db) {
        this.db = db;
    }
}

export class DbService extends EventParser {
    database: Db;

    constructor() {
        super();
        this.eventsToHandlersMap = {};

        const client = new MongoClient(URI, { serverApi: ServerApiVersion.v1 });
        this.database = client.db(dbConfig.database);
    }

    getCachedData = (collectionName: string, callback: (data: any) => void) => {
        fs.readFile('./cachedDb/' + collectionName + '.json', 'utf8', (err, data) => {
            if (err != null) {
                callback({})
                return;
            }
            callback(JSON.parse(data))
        });
    }

    fetchDataFromDb: (collectionName: string) => Promise<Record<string, any>> = async (collectionName: string) => {
        const collection = this.database.collection(collectionName);
        const data = await collection.find().toArray();

        const output = _.chain(data)
            .keyBy('_id')
            .mapValues(characterClass => ({
                id: characterClass._id.toString(),
                ..._.omit(characterClass, '_id')
            }))
            .value() as Record<string, any>;

        fs.writeFile('./cachedDb/' + collectionName + '.json', JSON.stringify(output), (err) => {
            if (err != null) {
                console.log(err)
            }
        });

        return output;
    };

    watchForDataChanges = (collectionName: string, onChange) => {
        const collection = this.database.collection(collectionName);
        let changeStream = collection.watch([], { fullDocument: "updateLookup" });

        changeStream.on("change", (changeEvent) => onChange(changeEvent));
    }

    getDb = () => this.database;
}
