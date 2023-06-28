import { dbConfig } from 'apps/engine/database';
import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { EventParser } from '../EventParser';

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

    getDb = () => this.database;
}
