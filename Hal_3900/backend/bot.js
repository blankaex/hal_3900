const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'database';
const DB = require('./db');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const DFconfig = require('./DFServiceAccount.json');

module.exports = class Bot {
	constructor() {
		this.version = '0.1';
		this.db = new DB();
		// Async connection
		this.db.connect()
		
		// Create DF session
		const sessionId = uuid.v4();
		
		// Create a new session
		this.DF = {};
		this.DF.sessionClient = new dialogflow.SessionsClient();
		this.DF.sessionPath = this.DF.sessionClient.sessionPath(DFconfig.project_id, sessionId);
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
		console.log(request);
		// process the user's request and return an instance of DetectIntentResponse
		const responses = await this.DF.sessionClient.detectIntent(request);
		console.log(responses);
		const result = responses[0].queryResult;
		return {
			response: result.fulfillmentText,
			intent: result.intent ? result.intent.displayName : '[UNKNOWN]'
		};
	}
};
