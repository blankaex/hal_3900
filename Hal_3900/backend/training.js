function multiplyTag(num) {
    return {
        $mul:{
            "tags.$.theta" : num
        }
    }
}

function incrementAnswer(num) {
    return {
        $inc:{
            "answers.$.theta" : num
        }
    }
}

function bumpThetha(dbConn, id, tag) {
    const collection = dbConn.collection('block');
    const search = { "_id": id, "tags.name": tag };
    collection.updateOne(search, multiplyTag(amount));
}

function penaliseTag(dbConn, id, tag) {
    const collection = dbConn.collection('block');
    const search = { "_id": id, "tags.name": tag };
    collection.updateOne(search, multiplyTag(amount))
}

/*
 * Training, takes a query context and a user choice
 * to adjust values in the database.
 *     dbConn     - The db connection
 *     rawOptions - Raw datapoints returned from tag search  
 *     options    - All options presented to the user
 *     best       - The index of the best answer the user chose
 *     tags       - The original SearchTags
 */
module.exports = async function training(dbConn, rawOptions, options, best, tags) {
    tags.map(x => bumpThetha(dbConn, rawOptions[best]["_id"], x, 1.03));
    [0,1,2,3].filter(i=>i != best).map(i => penaliseTag(dbConn, rawOptions[i]["_id"], x, 0.97))
    
    // If the best response was a question, increment answer relevance by 1
    if (rawOptions[best].type === "question") {
        const collection = dbConn.collection('forum');
        const search = {
            "question": rawOptions[best].text,
            "answers.text": options[best]
        };
        collection.updateOne(search, incrementAnswer(1));
    }
};
