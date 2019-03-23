const MongoClient = require('mongodb').MongoClient;

const find_all_from_collection = async (dbConn, collectionName) => {
    console.log("showing data from " + collectionName);
    const collection = dbConn.collection(collectionName);
    let results;
    try {
        const cursor = collection.find({});
        results = await cursor.toArray();
        cursor.close();
    } catch(err) {
        console.dir(err);
    }

    return results;
};

module.exports = {show_all_from_collection};