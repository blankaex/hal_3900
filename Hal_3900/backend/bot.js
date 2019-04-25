const DB = require('./db');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const DFconfig = require('./DFServiceAccount_wordbag.json');
const training = require('./training');
const { performIR } = require('./ir');
const logger = require('log4js').getLogger('Bot');
logger.level = 'info';

function hasTag(c, t) {
	return c.tags.map(x => x.name).includes(t)
}

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
		let candidates = [];		
		let collection = await this.db.findAllFromCollection('block');
		
		for (const tag of tags) {
			const matches = collection.filter(c => hasTag(c, tag));
			candidates = candidates.concat(matches);
		};

		return candidates
	}

	async generateOptions(searchTags, intent) {
		const candidates = await this.getCandidates(searchTags);
		let { options, context } = await performIR(this.db, searchTags, candidates, intent);
		const id = uuid.v4();
		context["_id"] = id;

		options = options.map(x => {
			return {
				queryId: id,
				text: x
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
		
		try {
			const intent = result.intent.displayName;
			let options;
			if (intent === 'quiz'){
				options = await this.db.getQuizQuestions();
			} else {
				let searchTags = responses[0].queryResult.parameters.fields.word_bag.listValue.values;
				searchTags = searchTags.map(x=>x.stringValue);
				options = await this.generateOptions(searchTags, intent);

				options = options.map(x => { return { ...x, question: msg } });
			}
			return {
				response: result.fulfillmentText,
				options,
				intent: result.intent ? result.intent.displayName : '[UNKNOWN]'
			};
		} catch (err) {
			logger.error(err);
			return {
				response: result.fulfillmentText,
				options: null,
				intent: result.intent ? result.intent.displayName : '[UNKNOWN]'
			};
		}
	}
};
