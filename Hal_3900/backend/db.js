const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

module.exports = class DB {
    constructor (dbUrl, dbName) {
        this.dbConn = null;
        this.dbUrl = dbUrl;
        this.dbName = dbName;
    }

    async connect(dbUrl,dbName) {
        const mongoConfig = {
            useNewUrlParser: true
        };
        try {
            const client = await MongoClient.connect(this.dbUrl,mongoConfig);
            console.log("Connected to database successfully");
            this.dbConn = client.db(this.dbName);
        } catch(err) {
            console.dir(err);
        }
    }

    async dump(objects) {
        const collection = this.dbConn.collection('documents');
        try {
            const res = await collection.insertMany(objects);
            console.log(`Inserted ${res.insertedCount} objects`);
        } catch(err) {
            console.dir(err);
        }
    }

    // feed me an array of db objects and the name of collection they belong to
    async addToCollection(objects, collectionName) {
        const collection = this.dbConn.collection(collectionName);
        try {
            const res = await collection.insertMany(objects);
            console.log(`Inserted ${res.insertedCount} objects`);
        } catch(err) {
            console.dir(err);
        }
    }

    async search(obj) {
        const collection = this.dbConn.collection('documents');
        let results = [];
        try {
            const cursor = collection.find(obj);
            results = await cursor.toArray();
            cursor.close();
        } catch(err) {
            console.dir(err);
        }
        return results;
    }

    async initData () {
        // TODO move data out of src!
        const dataDir = "../data_extraction/src/data";
        const forumDir = "../data_extraction/src/data_forum";
        // GET FORUM POSTS
        fs.readdir(forumDir, async (err, items) => {
            // put forum post array from each file into the db
            items.forEach(i => {
                const forum = require(i);
                // dump into db
                this.addToCollection(forum.posts, 'forum');
            });
        });
        // GET BLOCK AND GROUPED
        fs.readdir(dataDir, async (err, items) => {
            items.forEach(i => {
                const dataObject = require(i);
                // dump into db
                this.addToCollection(dataObject.grouped, 'grouped');
                this.addToCollection(dataObject.block, 'block');
            })
        })


    };

};