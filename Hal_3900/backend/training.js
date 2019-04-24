const MongoClient = require('mongodb').MongoClient;

const training = async (dbConn,resp,best,tags) => {
    try {
//increasing
        var typeBest;
        dbConn.collection('tf-idf-block.json').find({"_id":resp[best]["_id"]}).forEach(x=> typeBest = x["type"]);
        tags.map(x=> {dbConn.collection('tf-idf-block.json').updateOne({"_id":resp[best]["_id"],"tags.name": x}, {$mul:{"tags.$.theta" : 1.3}});})
        if(typeBest === "question"){
            dbConn.collection('forum').updateOne({"_id": resp[best]["_id"],"answers.text":resp},{$inc:{"answers.$.theta" : 1}})});
        }
//decreasing
        for(var i=0; i<4;i++){
            if(i !== best){
                tags.map(x=> {dbConn.collection('tf-idf-block.json').updateOne({"_id":resp[i]["_id"],"tags.name": x}, {$mul:{"tags.$.theta" : 0.7};
            }

        }
    } catch (err) {
        console.dir(err);
    }
};
module.exports = {training};