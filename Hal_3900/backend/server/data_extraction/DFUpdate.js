const dialogflow = require('dialogflow');// Imports the Dialogflow library
const projectId = 'hal-3900-tfidf';
const entityTypeId = '7df0bd4f-51d5-4952-aca6-bf889621fe84';
//The list of common english grammar words which we be deleted in the tag list
const commonList = ['the','be','to','of','and','a','in','that','have','I','it','for','on','with','he','as','you','do','did','at','this',
                    'but','his','by','from','they','we','say','said','her','she','or','an','will','would','my','mine','one','all','there',
                    'their','what','so','up','out','if','about','who','get','which','go','went','got','gotten','me','when','can','like',
                    'just','him','know','knew','take','toke','taken','into','your','some','could','them','see','saw','other','then','now',
                    'look','only','come','came','its','over','think','also','back','use','after','how','our','ours','even','want','because',
                    'any','these','us','whats','whatever','somewhat'];

//var testList = ['yw','yw','the',' ',' ','  '];

async function updateDF(tags) {
    // [START dialogflow_create_entity]
    // Imports the Dialogflow library

    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient();
    // The path to the agent the created entity belongs to.
    const agentPath = entityTypesClient.entityTypePath(projectId, entityTypeId);
    let entity = [];
    tags.filter(x=>{return commonList.indexOf(x) === -1}).map(x=>x.replace(/\s+/g, "")).filter(x=>{return x!== ''}).map(x => {entity.push({value:x,synonyms:[x]})});
    if(entity.length !== 0) {
        const createEntitiesRequest = {
            parent: agentPath,
            entities: entity,
        };
        //entity.map(x=>{if (x.value==='')console.log(entity.indexOf(x))});
        const [response] = await entityTypesClient.batchCreateEntities(
            createEntitiesRequest
        );
        // console.log('Created entity type:');
        // console.log(response);
    }

    // [END dialogflow_create_entity]
}


module.exports ={updateDF};
