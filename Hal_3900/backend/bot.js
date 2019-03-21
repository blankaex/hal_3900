const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'database'

MongoClient.connect(dbUrl, function(err, client) {
	if(err) return console.dir(err);
	console.log("Connected to database successfully");
	const db = client.db(dbName);
	// Template
	insertDocuments(db, function() {
		findDocuments(db, function() {
			client.close();
		});
	});
	// /Template
});

// Template Method
const insertDocuments = function(db, callback) {
	// Get the documents collection
	const collection = db.collection('documents');
	// Insert some documents
	collection.insertMany([
		{a : 1}, {a : 2}, {a : 3}
	], function(err, result) {
		console.log("Inserted 3 documents into the collection");
		callback(result);
	});
}

// Template method
const findDocuments = function(db, callback) {
	// Get the documents collection
	const collection = db.collection('documents');
	// Find some documents
	collection.find({'a': 3}).toArray(function(err, docs) {
		console.log("Found the following records");
		console.log(docs);
		callback(docs);
	});
}

module.exports = class Bot {
	constructor() {
		this.version = '0.0'
	}
	query(msg) {
		return "lol i dunno"
	}
}
