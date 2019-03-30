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

const find_all_by_tag = async (tag, dbConn) => {
    const grouped = await find_by_collection_and_tag(tag, dbConn, 'grouped');
    const block = await find_by_collection_and_tag(tag, dbConn, 'block');
    const forum = await find_by_collection_and_tag(tag, dbConn, 'forum');

    return {grouped, forum, block};
};

const get_unique_tags_from_collection = async (dbConn, collectionName) => {
    const collection = dbConn.collection(collectionName);
    try {
        return await collection.distinct("tags.name");
    } catch (err) {
        console.dir(err);
    }
};

const get_all_unique_tags = async (dbConn) => {
    const grouped = await get_unique_tags_from_collection(dbConn, 'grouped');
    const block = await get_unique_tags_from_collection(dbConn, 'block');
    const forum = await get_unique_tags_from_collection(dbConn, 'forum');

    // reduce to single array of unique
    let tagSet = new Set(grouped);
    for (const b of block){
        tagSet.add(b)
    }
    for (const f of forum){
        tagSet.add(f);
    }
    return Array.from(tagSet);

};


module.exports = {find_all_from_collection, find_by_collection_and_tag, get_all_unique_tags};