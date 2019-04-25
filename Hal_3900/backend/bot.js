const DB = require('./db');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const DFconfig = require('./DFServiceAccount_wordbag.json');
const training = require('./training');
const { performIR } = require('./ir');
const logger = require('log4js').getLogger('Bot');
logger.level = 'info';

module.exports = class Bot {
	constructor() {
		this.version = '0.1';

		this.db = new DB();
		// Async connection
		this.db.connect().then(_=>{
			logger.info("Initialising db with data");
			this.db.initData();
		});
		// Create DF session
		const sessionId = uuid.v4();
		
		// Create a new session
		this.DF = {};
		this.DF.sessionClient = new dialogflow.SessionsClient();
		this.DF.sessionPath = this.DF.sessionClient.sessionPath(DFconfig.project_id, sessionId);
	}

	async train(course, queryId, choice) {
		// TODO: handle course
		const query = {
			'_id': {
				$eq: queryId
			}
		}		
		const {rawOptions, options, searchTags} = await this.db.search(query, collection='query_contexts')[0];
		await training(this.db, rawOptions, options, choice, searchTags);
	}

	async getCandidates(tags) {
		const candidates = [];
		const collection = this.dbConn.collection('block');
		for(const tag of tags){
			// find all objects where tags contains an array elem with name = tag
			const cursor = await collection.find({ "tags.name": tag });
			const results = await cursor.toArray();
			candidates = candidates.concat(results);
		};
		return candidates
	}

	async generateOptions(searchTags) {
		const candidates = this.getCandidates(searchTags);
		const {options, context} = await performIR(searchTags, candidates);
		const uuid = uuid.v4();
		context["_id"] = uuid;

		options = options.map(x => {
			return {
				queryId: uuid,
				...x,
				question: msg,
			 }
		});

		await this.db.addToCollection([context], collection='query_contexts');
		
		return options;
	}

	async query(msg) {
		const request = {
			session: this.DF.sessionPath,
			queryInput: {
			  text: {
				text: msg,
				languageCode: 'en'
			  }
			}
		};

		// process the user's request and return an instance of DetectIntentResponse
		const responses = await this.DF.sessionClient.detectIntent(request);
		const result = responses[0].queryResult;
		// TODO: handle intent = quiz question
		try {
			const intent = result.intent.displayName;
			let options;
			if (intent === 'quiz'){
				options = await this.db.getQuizQuestions();
			} else {
				let searchTags = responses[0].queryResult.parameters.fields.content.listValue.values;
				searchTags = searchTags.map(x=>x.stringValue);
				options = await this.generateOptions(searchTags, intent);
				options = options.map(x => {return{...x,question: msg}});
			}
			return {
				response: result.fulfillmentText,
				options,
				intent: result.intent ? result.intent.displayName : '[UNKNOWN]'
			};
		} catch (err) {
			console.log(err);
			return {
				response: result.fulfillmentText,
				options: null,
				intent: result.intent ? result.intent.displayName : '[UNKNOWN]'
			};
		}
	}
};
