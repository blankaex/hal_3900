// Given a candiate and a list of tags
// calculates it's score
function calcScore(tags, candidate) {
    //final_score = matched_tags_sailence + matched_tags_theta
    return candidate.tags.reduce(
        (acc, tag) => acc + (tags.includes(tag["name"]) ? tag.salience + tag.theta: 0),
        0
    );
}
// input: tags extracted by dialogflow
//        candidates which have the tags, got by db_query.js
function performIR(tags, candidates) {
    //calculate scores for each candidate
    candidates = candidates.map((candidate)=>{
        return {
            ...candidate,
            _score: calcScore(tags, candidate),
        }
    });
    // sort by score
    candidates = candidates.sort((a,b)=> b._score - a._score);
    
    // filter out duplicates
    const response= candidates.filter((value, index, self)=>self.indexOf(value) === index);
    
    return response.slice(0,4); // output top 3 results
}

function pick_answer(post) {
    const scope = post.answers.reduce((acc, answer) => acc + answer["theta"], 0);
    //console.log(scope);
    var seed = Math.floor(Math.random() * scope)+1; // get random int number in [1,scpoe]
    //console.log(seed);
    var resp;

    for (var i = 0; i < post.answers.length; i++) {
        if (post.answers[i]["theta"] >= seed) {
            resp = post.answers[i]["text"];
            break;
        } else {
            seed -= post.answers[i]["theta"];
        }
    }


    return resp;
}


module.exports = {performIR, pick_answer};