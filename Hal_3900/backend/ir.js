//candidate: [{"tags":
//              "text":},{}...]
function sortNumber(a,b)
{
    return b - a
}
// input: tags extracted by dialogflow
//        candidates which have the tags, got by db_query.js
const ir = function (tags, candidates) {
    var scores = [];
    var sc;
    //calculate scores for each candidate
    for(var i = 0; i< candidates.length;i++){
        sc = 0;
        for(var j = 0; j< tags.length;j++){
            var sailence = 0;
            //var theta = 0;
            for(var k =0; k< candidates[i].tags.length;k++){
                if (candidates[i].tags[k]["name"] == tags[j]){
                    sailence = candidates[i].tags[k].salience;
                    //theta = candidates[i].tags[k].theta;
                    sc += sailence //* theta;
                }
            }

        }
        scores.push(sc);
    }
    var sortScores = [...scores];
    sortScores.sort(sortNumber); // sort scores
    //console.log(sortScores);
    var response=[];
    var responseIndex = [];
    responseIndex.push(candidates[scores.indexOf(sortScores[0])]);
    //avoid redundency
    if(responseIndex[0]!=candidates[scores.indexOf(sortScores[1])]){
        responseIndex.push(candidates[scores.indexOf(sortScores[1])])
    }
    if(candidates[scores.indexOf(sortScores[1])]!=candidates[scores.indexOf(sortScores[2])]){
        responseIndex.push(candidates[scores.indexOf(sortScores[2])])
    }
    response.push(responseIndex[0]);
    response.push(responseIndex[1]);
    response.push(responseIndex[2]);
    /* re-arrange to unify the format of entities from block and forum
    for(var y = 0; y<response.length;y++){
        if(!response[y].hasOwnProperty("text")){


        }
    }
     */
    return response; //output response array, each entity is in its original format
};


module.exports = {sortNumber,ir};