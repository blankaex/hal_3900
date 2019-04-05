const MongoClient = require('mongodb').MongoClient;

const training = async (dbConn, bestResponse,ct,tags) => {
    try {
        if(ct == "block"){
            for(var i =0; i< tags.length;i++){
                dbConn.ct.update({"text" :  bestResponse,"tags.name": tags[i]}, {$set:{"tags.theta" : "tags.theta"+"tags.sailence"}});
            }
        }else if(ct == "forum"){
            for(var i =0; i< tags.length;i++){
                dbConn.ct.update({"answers": bestResponse,"tags.name":tags[i]},{$set:{"tags.theta" : "tags.theta"+"tags.sailence"}});
            }
        }
    } catch (err) {
        console.dir(err);
    }
};
module.exports = {training};