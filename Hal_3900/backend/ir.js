// Given a candiate and a list of tags
// calculates it's score
function calcScore(tags, candidate) {
    return candidate.tags.reduce((acc, tag) => acc + (tags.includes(tag["name"]) ? tag.salience : 0), 0);
}
// input: tags extracted by dialogflow
//        candidates which have the tags, got by db_query.js
function performIR(tags, candidates) {
    //calculate scores for each candidate
    candidates = candidates.map((candidate)=>{
        return {
            ...candidate,
            _score: calcScore(tags, candidate)
        }
    });
    // sort by score
    candidates = candidates.sort((a,b)=> b._score - a._score);
    
    // filter out duplicates
    const response= candidates.filter((value, index, self)=>self.indexOf(value) === index);
    
    return response.slice(0,4); // output top 3 results
};

module.exports = {performIR};