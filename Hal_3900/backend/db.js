const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const logger = require('log4js').getLogger('Database');
const dataExtraction = require('./data_extraction/data_extraction.js');
logger.level = 'info';

// Helper function to make fs.readdir
// actually async
function asyncReadDir(path) {
	return new Promise((resolve,reject)=>{
		fs.readdir(path,(err,items)=>{
			if (err) reject(err);
			resolve(items);
		})
	})
}

function calcScore(tags, candidate) {
	return candidate.tags.reduce(
			(acc, tag) => acc + (tags.includes(tag["name"]) ? tag.salience : 0),
			0
	);
}

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
		// this.backup();
		let knownCollections = await this.dbConn.listCollections().toArray();
		knownCollections = knownCollections.map(x=>x.name);
		if (knownCollections.indexOf("forum") !== -1) {
			logger.info(`Detected collections, skipping init step`);
			return;
		}

		if (fs.existsSync('../data/db_backup.json')){
			logger.info(`Restoring data from backup`);
			this.restore();
			return;
		}

		logger.info('Starting scraper to initialize data. This might take a while');
		this.runTaskQueue(require("./pagesToScrape.json"))

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
		const collection = this.dbConn.collection(collectionName);
		// find all objects where tags contains an array elem with name = tag
		const cursor = await collection.find({ tags: { $elemMatch: { "name": tag } } } );
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
		block.map(b=>tagSet.add(b))
		forum.map(f=>tagSet.add(f))
		return Array.from(tagSet);
	};
	
	async getDataPoints(tags) {
		let candidates = await this.findAllFromCollection('grouped');
		candidates = candidates.concat(await this.findAllFromCollection('block'));
		candidates = candidates.concat(await this.findAllFromCollection('forum'));

		//calculate scores for each candidate
		candidates = candidates.map((candidate)=>{
				return {
						...candidate,
						_score: calcScore(tags, candidate)
				}
		});
		
		// sort by score
		candidates = candidates.sort((a,b)=> b._score - a._score);
		
		// filter out duplicates
		const response = candidates.filter((value, index, self)=>self.indexOf(value) === index);
		return response.slice(0,4); // output top 3 results
	};

	async train(bestResponse, ct, tags) {
		if(ct == "block"){
			for(var i =0; i< tags.length;i++){
				this.dbConn.ct.update({"text" :  bestResponse,"tags.name": tags[i]}, {$set:{"tags.theta" : "tags.theta"+"tags.sailence"}});
			}
		} else if(ct == "forum"){
			for(var i =0; i< tags.length;i++){
				this.dbConn.ct.update({"answers": bestResponse,"tags.name":tags[i]},{$set:{"tags.theta" : "tags.theta"+"tags.sailence"}});
			}
		}
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

