const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'database';
const DB = require('./db');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
<<<<<<< HEAD
const DFconfig = require('./DFServiceAccount.json');
=======
const logger = require('log4js').getLogger('Bot');
logger.level = 'info';
>>>>>>> master

module.exports = class Bot {
	constructor() {
		this.version = '0.1';
		this.db = new DB();
		// Async connection
<<<<<<< HEAD
		this.db.connect()
		
=======
		this.db.connect().then(_=>{
			logger.info("Initialising db with data");
			this.db.initData();
		});
>>>>>>> master
		// Create DF session
		const sessionId = uuid.v4();
		
		// Create a new session
		this.DF = {};
		this.DF.sessionClient = new dialogflow.SessionsClient();
<<<<<<< HEAD
		this.DF.sessionPath = this.DF.sessionClient.sessionPath(DFconfig.project_id, sessionId);
=======
		// TODO: move these into env vars
		const projectId = "test-53d52";
		this.DF.sessionPath = this.DF.sessionClient.sessionPath(projectId, sessionId);
>>>>>>> master
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
		try {
			let searchTags = responses[0].queryResult.parameters.fields.content.listValue.values;
			searchTags = searchTags.map(x=>x.stringValue);
			let options = await this.db.getDataPoints(searchTags);
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
