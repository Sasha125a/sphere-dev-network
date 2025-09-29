class VirtualDatabase {
    constructor() {
        this.databases = new Map();
        this.setupDefaultDatabases();
    }

    setupDefaultDatabases() {
        this.databases.set('default', {
            type: 'sql',
            tables: new Map(),
            queries: 0
        });

        this.databases.set('mongodb', {
            type: 'nosql',
            collections: new Map(),
            documents: 0
        });
    }

    createDatabase(dbName, type = 'sql') {
        const db = {
            type,
            tables: new Map(),
            collections: new Map(),
            queries: 0,
            documents: 0
        };
        
        this.databases.set(dbName, db);
        return db;
    }

    createTable(dbName, tableName, schema) {
        const db = this.databases.get(dbName) || this.createDatabase(dbName);
        
        db.tables.set(tableName, {
            schema,
            data: [],
            indexes: new Map()
        });

        return { success: true, message: `Table ${tableName} created` };
    }

    insert(dbName, tableName, record) {
        const db = this.databases.get(dbName);
        if (!db) throw new Error(`Database ${dbName} not found`);

        const table = db.tables.get(tableName);
        if (!table) throw new Error(`Table ${tableName} not found`);

        const id = Date.now() + Math.random();
        const recordWithId = { id, ...record, createdAt: new Date() };
        table.data.push(recordWithId);

        db.queries++;
        return { id, ...recordWithId };
    }

    query(dbName, tableName, conditions = {}) {
        const db = this.databases.get(dbName);
        if (!db) throw new Error(`Database ${dbName} not found`);

        const table = db.tables.get(tableName);
        if (!table) throw new Error(`Table ${tableName} not found`);

        let results = table.data;

        Object.entries(conditions).forEach(([key, value]) => {
            results = results.filter(record => record[key] === value);
        });

        db.queries++;
        return results;
    }

    getDatabaseStats(dbName) {
        const db = this.databases.get(dbName);
        if (!db) return null;

        if (db.type === 'sql') {
            return {
                type: 'SQL',
                tables: db.tables.size,
                totalRecords: Array.from(db.tables.values()).reduce((sum, table) => sum + table.data.length, 0),
                queries: db.queries
            };
        } else {
            return {
                type: 'NoSQL',
                collections: db.collections.size,
                totalDocuments: db.documents,
                queries: db.queries
            };
        }
    }
}

export default new VirtualDatabase();