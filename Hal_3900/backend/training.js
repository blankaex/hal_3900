const MongoClient = require('mongodb').MongoClient;

//input:
// dbConn - the db connection
// resp   - the output of getDatapoint()
//theAnswer - the output of pick_answer() if it be called, otherwise just set it to null
//            use it to match the answer in forum collection
//best     - the index of the best answer
//tags     - searchTags
const training =async (dbConn,resp,theAnswer,best,tags)=>{
    try {
//increasing
        var typeBest = resp[best].type;
	
	    //var dbConn = this.dbConn;
        tags.map(x=> {dbConn.collection('block').updateOne({"_id":resp[best]["_id"],"tags.name": x}, {$mul:{"tags.$.theta" : 1.03}});});
        if(typeBest === "question"){
            dbConn.collection('forum').updateOne({"question":resp[best]["text"],"answers.text":theAnswer},{$inc:{"answers.$.theta" : 1}})}

//decreasing
        for(var i=0; i<4;i++){
            if(i !== best){
                tags.map(x=> {dbConn.collection('block').updateOne({"_id":resp[i]["_id"],"tags.name": x}, {$mul:{"tags.$.theta" : 0.97}})});
            }

        }
    } catch (err) {
        console.dir(err);
    }
};

module.exports = {training};