const DB = require('./db');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const DFconfig = require('./DFServiceAccount.json');
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
	async train(choice) {
		logger.info(`TRAINING FROM CHOICE ${choice.text}`);
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
		// console.log(result.intent.displayName); // INTENT found through result.intent.displayName

		// TODO handle intent = quiz question
		try {
			const intent = result.intent.displayName;
			let searchTags = responses[0].queryResult.parameters.fields.content.listValue.values;
			searchTags = searchTags.map(x=>x.stringValue);
			let options = await this.db.getDataPoints(searchTags, intent);

			options = options.map(x => {return{...x,question: msg}});

			return {
				response: result.fulfillmentText,
				options,
				intent: result.intent ? result.intent.displayName : '[UNKNOWN]'
			};
		} catch {
			return {
				response: result.fulfillmentText,
				options: null,
				intent: result.intent ? result.intent.displayName : '[UNKNOWN]'
			};
		}
	}
};
