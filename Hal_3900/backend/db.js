const MongoClient = require('mongodb').MongoClient;

module.exports = class DB {
    constructor (dbUrl, dbName) {
        this.dbConn = null
        this.dbUrl = dbUrl
        this.dbName = dbName
    }

    async connect(dbUrl,dbName) {
        const mongoConfig = {
            useNewUrlParser: true
        }
        try {
            const client = await MongoClient.connect(this.dbUrl,mongoConfig)
            console.log("Connected to database successfully")
            this.dbConn = client.db(this.dbName)
        } catch(err) {
            console.dir(err)
        }
    }

    async dump(objects) {
        const collection = this.dbConn.collection('documents');
        try {
            const res = await collection.insertMany(objects)
            console.log(`Inserted ${res.insertedCount} objects`)
        } catch(err) {
            console.dir(err)
        }
    }

    async search(obj) {
        const collection = this.dbConn.collection('documents')
        let results = []
        try {
            const cursor = collection.find(obj)
            results = await cursor.toArray()
            cursor.close()
        } catch(err) {
            console.dir(err)
        }
        return results
    }
}