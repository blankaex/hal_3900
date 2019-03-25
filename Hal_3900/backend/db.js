const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const query = require('./db_query');

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
            // console.log(`Inserted ${res.insertedCount} objects`);
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
        const dataDir = "../data_extraction/data_page/";
        const forumDir = "../data_extraction/data_forum/";
        // GET FORUM POSTS
        await fs.readdir(forumDir, async (err, items) => {
            // put forum post array from each file into the db
            items.forEach(async (i) => {
                const forum = require(forumDir + i);
                // dump into db
                try {
                    await this.addToCollection(forum.posts, 'forum');
                } catch (err){
                    console.error(err);
                }
            });
        });
        // GET BLOCK AND GROUPED
        await fs.readdir(dataDir, async (err, items) => {
            items.forEach(async (i) => {
                const dataObject = require(dataDir + i);
                // dump into db
                await this.addToCollection(dataObject.grouped, 'grouped');
                await this.addToCollection(dataObject.block, 'block');
            });
        });


        // USE THIS TO TEST SEARCH BY TAG
        // console.log("searching for Lecture posts");
        const search = await query.find_by_collection_and_tag("mips", this.dbConn, 'block');
        // const all = await query.find_all_from_collection(this.dbConn, 'forum');
        console.log(search);
    };

};