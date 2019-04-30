const dialogflow = require('dialogflow');// Imports the Dialogflow library
const projectId = 'hal-3900-tfidf';
const entityTypeId = '7df0bd4f-51d5-4952-aca6-bf889621fe84';
const commonList = ['the','be','to','of','and','a','in','that','have','I','it','for','on','with','he','as','you','do','did','at','this',
                    'but','his','by','from','they','we','say','said','her','she','or','an','will','would','my','mine','one','all','there',
                    'their','what','so','up','out','if','about','who','get','which','go','went','got','gotten','me','when','can','like',
                    'just','him','know','knew','take','toke','taken','into','your','some','could','them','see','saw','other','then','now',
                    'look','only','come','came','its','over','think','also','back','use','after','how','our','ours','even','want','because',
                    'any','these','us'];
//var testList = ['yw','yw1','the','be'];
// /////////////////////////////////////////////////////////////////////////////
// Operations for entity types.
// /////////////////////////////////////////////////////////////////////////////

async function createEntityType(projectId, displayName, kind) {
    // [START dialogflow_create_entity_type]


    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient();

    // The path to the agent the created entity type belongs to.
    const agentPath = entityTypesClient.projectAgentPath(projectId);

    const createEntityTypeRequest = {
        parent: agentPath,
        entityType: {
            displayName: displayName,
            kind: kind,
        },
    };

    const responses = await entityTypesClient.createEntityType(
        createEntityTypeRequest
    );
    console.log(`Created ${responses[0].name} entity type`);
    // [END dialogflow_create_entity_type]
}

async function listEntityTypes(projectId) {
    // [START dialogflow_list_entity_types]


    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient();

    // The path to the agent the entity types belong to.
    const agentPath = entityTypesClient.projectAgentPath(projectId);

    const request = {
        parent: agentPath,
    };

    // Call the client library to retrieve a list of all existing entity types.
    const [response] = await entityTypesClient.listEntityTypes(request);
    response.forEach(entityType => {
        console.log(`Entity type name: ${entityType.name}`);
        console.log(`Entity type display name: ${entityType.displayName}`);
        console.log(`Number of entities: ${entityType.entities.length}\n`);
    });
    return response;
    // [END dialogflow_list_entity_types]
}

async function deleteEntityType(projectId, entityTypeId) {
    // [START dialogflow_delete_entity_type]
    // Imports the Dialogflow library
    const dialogflow = require('dialogflow');

    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient();

    const entityTypePath = entityTypesClient.entityTypePath(
        projectId,
        entityTypeId
    );

    const request = {
        name: entityTypePath,
    };

    // Call the client library to delete the entity type.
    const response = await entityTypesClient.deleteEntityType(request);
    console.log(`Entity type ${entityTypePath} deleted`);
    return response;
    // [END dialogflow_delete_entity_type]
}

// /////////////////////////////////////////////////////////////////////////////
// Operations for entities.
// /////////////////////////////////////////////////////////////////////////////

async function createEntity(projectId, entityTypeId, entityValue, synonyms) {
    // [START dialogflow_create_entity]
    // Imports the Dialogflow library
    const dialogflow = require('dialogflow');

    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient();

    // The path to the agent the created entity belongs to.
    const agentPath = entityTypesClient.entityTypePath(projectId, entityTypeId);

    const entity = {
        value: entityValue,
        synonyms: synonyms,
    };

    const createEntitiesRequest = {
        parent: agentPath,
        entities: [entity],
    };

    const [response] = await entityTypesClient.batchCreateEntities(
        createEntitiesRequest
    );
    console.log('Created entity type:');
    console.log(response);
    // [END dialogflow_create_entity]
}

async function listEntities(projectId, entityTypeId) {
    // [START dialogflow_create_entity]
    // Imports the Dialogflow library
    const dialogflow = require('dialogflow');

    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient();

    // The path to the agent the entity types belong to.
    const entityTypePath = entityTypesClient.entityTypePath(
        projectId,
        entityTypeId
    );

    // The request.
    const request = {
        name: entityTypePath,
    };

    // Call the client library to retrieve a list of all existing entity types.
    const [response] = await entityTypesClient.getEntityType(request);
    response.entities.forEach(entity => {
        console.log(`Entity value: ${entity.value}`);
        console.log(`Entity synonyms: ${entity.synonyms}`);
    });
    return response;
    // [END dialogflow_create_entity]
}

async function deleteEntity(projectId, entityTypeId, entityValue) {
    // [START dialogflow_delete_entity]
    // Imports the Dialogflow library
    const dialogflow = require('dialogflow');

    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient();

    // The path to the agent the entity types belong to.
    const entityTypePath = entityTypesClient.entityTypePath(
        projectId,
        entityTypeId
    );

    const request = {
        parent: entityTypePath,
        entityValues: [entityValue],
    };

    // Call the client library to delete the entity type.
    await entityTypesClient.batchDeleteEntities(request);
    console.log(`Entity Value ${entityValue} deleted`);
    // [END dialogflow_delete_entity]
}

