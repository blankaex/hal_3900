const MongoClient = require('mongodb').MongoClient;

const find_all_from_collection = async (dbConn, collectionName) => {
    const collection = dbConn.collection(collectionName);
    try {
        const cursor = await collection.find({});
        const results = await cursor.toArray();
        cursor.close();
        return results;
    } catch (err) {
        console.error(err);
    }
};

const find_by_collection_and_tag = async (tag, dbConn, collectionName) => {
    const collection = dbConn.collection(collectionName);
    try {
        // find all objects where tags contains an array elem with name = tag
        const cursor = await collection.find({ tags : { $elemMatch: {"name": tag} } } );
        const results = await cursor.toArray();
        cursor.close();
        return results;
        // return results;
    } catch (err) {
        console.dir(err);
    }
};

// feed me tag as a string
const find_all_by_tag = async (tag) => {


};


module.exports = {find_all_from_collection, find_by_collection_and_tag};