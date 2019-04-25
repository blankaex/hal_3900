const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const logger = require('log4js').getLogger('Database');
const dataExtraction = require('./data_extraction/data_extraction.js');
logger.level = 'info';

module.exports = class DB {
	constructor () {
		let url = 'mongodb://localhost:27017';
		if (process.env.PRODUCTION) url = 'mongodb://database:27017';
		this.dbConn = null;
		this.dbUrl = url;
		this.dbName = 'database';
	}
	
	async connect() {
		const mongoConfig = {
			useNewUrlParser: true
		};
		const client = await MongoClient.connect(this.dbUrl,mongoConfig);
		logger.info("Connected to database successfully");
		this.dbConn = client.db(this.dbName);
		//logger.info(`connect to:${dbConn}`)
	}
	
	async dump(objects, collection='documents') {
		const collectionRef = this.dbConn.collection(collection);
		const res = await collectionRef.insertMany(objects);
		logger.info(`Inserted ${res.insertedCount} objects into collection ${collection}`);
	}
	
	// feed me an array of db objects and the name of collection they belong to
	async addToCollection(objects, collection='documents') {
		const collectionRef = this.dbConn.collection(collection);
		const res = await collectionRef.insertMany(objects);
		logger.info(`Inserted ${res.insertedCount} objects into collection ${collection}`);
		return res;
	}
	
	async search(obj, collection='documents') {
		const collectionRef = this.dbConn.collection(collection);
		let results = [];
		results = await collectionRef.find(obj).toArray();
		return results;
	}

	// pagesToScrape must be a js object formatted as per spec in wiki
	async runTaskQueue (pagesToScrape) {
		if (!this.connected)
			await this.connect();

		 await dataExtraction.getDataToDb(pagesToScrape, this);
	}
	
	async initData () {
		//TODO remove before merge master
	    // this.backupCourse('COMP1521');
		// this.backupCourse('COMP1531');

		// const courseCode = 'COMP1531';
        // await this.runTaskQueue({courseCode});
		let knownCollections = await this.dbConn.listCollections().toArray();
		knownCollections = knownCollections.map(x=>x.name);
		if (knownCollections.indexOf("forum") !== -1) {
			logger.info(`Detected collections, skipping init step`);
			return;
		}
		const block = '../data/block.json';
		const forum = '../data/forum.json';
		const blockItem = require(block);
		const forumItem = require(forum);
		this.addToCollection(forumItem.forum, 'forum');
		//this.addToCollection(items.grouped, 'grouped');
		this.addToCollection(blockItem.block, 'block');


		//
		// if (fs.existsSync('../data/db_backup.json')){
		// 	logger.info(`Restoring data from backup`);
		// 	this.restore();
		// 	return;
		// }
		//
		// logger.info('Starting scraper to initialize data. This might take a while');
		// this.runTaskQueue(require("./pagesToScrape.json"))

		// this.backup(); // careful with synchronisation

	};
	
	async findAllFromCollection(collectionName) {
		const collection = this.dbConn.collection(collectionName);
		let results = [];
		const cursor = await collection.find({});
		results = await cursor.toArray();
		cursor.close();
		return results;
	};

	// pass in a group object, returns array of items from the group
	async findItemsByGroup(group){
		const itemIds = group.items.map(id => ObjectId(id));
		const collection = this.dbConn.collection('block');
		let results = [];
		const cursor = await collection.find({_id: {$in: itemIds}});
		results = await cursor.toArray();
		cursor.close();
		return results;
	}
	
	async findForumQuestionsByTopic(tag) {
		const collection = this.dbConn.collection('forum');
		const cursor = await collection.find({
			tags : {
				$elemMatch: {
					"name" : tag
				}
			}
		}, {tags: 0, _id:0});
		const results = await cursor.toArray();
		cursor.close();
		return results;
	}
	
	async findByCollectionAndTag(tag, collectionName) {
		logger.info(`get into searching function`);
		const collection = this.dbConn.collection(collectionName);
		// find all objects where tags contains an array elem with name = tag
		logger.info(`connect to db`);
		const cursor = await collection.find({"tags.name": tag } );
		logger.info('start to transform');
		const results = await cursor.toArray();
		cursor.close();
		return results;
	};
	
	async findByCollectionAndAllTags(tagsArray, collectionName) {
		const collection = this.dbConn.collection(collectionName);
		// find all objects where tags contains an array elem with name = tag
		const cursor = await collection.find({ "tags.name" : { $all: tagsArray } } );
		const results = await cursor.toArray();
		cursor.close();
		return results;
	};
	
	async findAllByTag(tag) {
		const grouped = await this.findByCollectionAndTag(tag, this.dbConn, 'grouped');
		const block = await this.findByCollectionAndTag(tag, this.dbConn, 'block');
		const forum = await this.findByCollectionAndTag(tag, this.dbConn, 'forum');
		
		return {grouped, forum, block};
	};

	async findByCourseCode(courseCode, collectionName) {
		const collection = this.dbConn.collection(collectionName);
		// find all objects where tags contains an array elem with name = tag
		const cursor = await collection.find({ courseCode: courseCode });
		const results = await cursor.toArray();
		cursor.close();
		return results;
	};

	async findAllByCourseCode(courseCode) {
		const grouped = await this.findByCourseCode(courseCode, 'grouped');
		const block = await this.findByCourseCode(courseCode, 'block');
		const forum = await this.findByCourseCode(courseCode, 'forum');

		return {grouped, forum, block};
	};
	
	async getUniqueTagsFromCollection(collectionName) {
		const collection = this.dbConn.collection(collectionName);
		return await collection.distinct("tags.name");
	};
	
	async getAllUniqueTags() {
		const grouped = await this.getUniqueTagsFromCollection(this.dbConn, 'grouped');
		const block = await this.getUniqueTagsFromCollection(this.dbConn, 'block');
		const forum = await this.getUniqueTagsFromCollection(this.dbConn, 'forum');
		
		// reduce to single array of unique
		let tagSet = new Set(grouped);
		block.map(b=>tagSet.add(b));
		forum.map(f=>tagSet.add(f));
		return Array.from(tagSet);
	};

	// backup whole db to this file
	async backup() {

		const filename = '../data/db_backup.json';
		const forum = await this.findAllFromCollection('forum');
		const grouped = await this.findAllFromCollection('grouped');
		const block = await this.findAllFromCollection('block');

		fs.writeFileSync(filename, JSON.stringify({forum, grouped, block}));
	}

	// backup single course to this file
	async backupCourse(courseCode) {
		const dirname = '../data/backups/';
		const filename = `${dirname}${courseCode}.json`;
		try {
			fs.mkdirSync(dirname, {recursive: true});
		} catch (err){
			console.log(err);
		}
		const data = await this.findAllByCourseCode(courseCode);
		fs.writeFileSync(filename, JSON.stringify(data));
	}

	async restore() {
		const filename = '../data/db_backup_old_1.json';
		const items = require(filename);
		this.addToCollection(items.forum, 'forum');
		this.addToCollection(items.grouped, 'grouped');
		this.addToCollection(items.block, 'block');

	}

	async restoreCourse(courseCode){
		const dirname = '../data/backups/';
		const filename = `${dirname}${courseCode}.json`;
		const items = require(filename);
		this.addToCollection(items.forum, 'forum');
		this.addToCollection(items.grouped, 'grouped');
		this.addToCollection(items.block, 'block');
	}
};

