const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'database'

module.exports = class Bot {
	constructor() {
		this.version = '0.0'
	}
	query(msg) {
		return "lol i dunno"
	}
}
