const {ObjectId} = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const logger = require('log4js').getLogger('Database');
const dataExtraction = require('./data_extraction/data_extraction.js');
logger.level = 'info';

function calcScore(tags, candidate) {
	logger.info(`score, ${candidate.text}`);
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

	async delete(obj, collection='documents') {
		const collectionRef = this.dbConn.collection(collection);
        await collectionRef.deleteOne(obj)
	}

	// pagesToScrape must be a js object formatted as per spec in wiki
	async runDataExtraction (pagesToScrape) {
		if (!this.connected)
			await this.connect();

		 await dataExtraction.getDataToDb(pagesToScrape, this);
	}
	
	async initData () {

		// await this.runDataExtraction(require("./pagesToScrape.json"));
        this.backup(); // careful with synchronisation

        console.log("DONE!");

		// let knownCollections = await this.dbConn.listCollections().toArray();
		// knownCollections = knownCollections.map(x=>x.name);
		// if (knownCollections.indexOf("forum") !== -1) {
		// 	logger.info(`Detected collections, skipping init step`);
		// 	return;
		// }
		// const block = '../data/tf-idf-block.json';
		// const forum = '../data/tf-idf-forum.json';
		// const blockItem = require(block);
		// const forumItem = require(forum);
		// this.addToCollection(forumItem.forum, 'forum');
		// //this.addToCollection(items.grouped, 'grouped');
		// this.addToCollection(blockItem.block, 'block');
		//
		// const filename = '../data/db_backup_tags_with_google_cloud_nlp.json';
		// if (fs.existsSync(filename)){
		// 	logger.info(`Restoring data from backup`);
		// 	this.restore(filename);
		// 	return;
		// }

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
	
	async findByCourseCode(courseCode, collectionName) {
		const collection = this.dbConn.collection(collectionName);
		// find all objects where tags contains an array elem with name = tag
		const cursor = await collection.find({ courseCode: courseCode });
		const results = await cursor.toArray();
		cursor.close();
		return results;
	};

	async findAllByCourseCode(courseCode) {
		const block = await this.findByCourseCode(courseCode, 'block');
		const forum = await this.findByCourseCode(courseCode, 'forum');

		return { block, forum };
	};
	
	async getUniqueTagsFromCollection(collectionName) {
		const collection = this.dbConn.collection(collectionName);
		return await collection.distinct("tags.name");
	};
	
	async getAllUniqueTags() {
		const grouped = await this.getUniqueTagsFromCollection(this.dbConn, 'grouped');
		const block = await this.getUniqueTagsFromCollection(this.dbConn, 'tf-idf-block.json');
		const forum = await this.getUniqueTagsFromCollection(this.dbConn, 'forum');
		
		// reduce to single array of unique
		let tagSet = new Set(grouped);
		block.map(b=>tagSet.add(b));
		forum.map(f=>tagSet.add(f));
		return Array.from(tagSet);
	};

	async getQuizQuestions(tags, intent, courseCode) {
		// TODO need to add courseCode param in: unused rn
		const candidates = await this.findAllFromCollection('quiz');
		// console.log(candidates);
		// TODO filter by tags

		// if (candidates.length > 0){
		// 	// choose 1 at random
		// 	// or choose a list if we know how many
		//
		// }

		return candidates;

	}
	
	async getDataPoints(tags) {
		let candidates = [];
		const collection = this.dbConn.collection('block');
		for (let i = 0; i < tags.length; i++){
			logger.info(`find tag ${tags[i]}`);
		
			logger.info(`get into searching function`);
		
		    // find all objects where tags contains an array elem with name = tag
		    const cursor = await collection.find({"tags.name":tags[i]});
			logger.info('start to transform');
			const results = await cursor.toArray();
			logger.info(`${results.length}`);
			candidates = candidates.concat(results);
		}
		logger.info(`candidates: ${candidates.length}`);
		// candidates = candidates.concat(await this.findAllFromCollection('block'));
		// candidates = candidates.concat(await this.findAllFromCollection('forum'));
		//calculate scores for each candidate

		candidates = candidates.map((candidate)=>{
				return {
						...candidate,
						_score: calcScore(tags, candidate),
				}
		});
		
		// sort by score
		candidates = candidates.sort((a,b)=> b._score - a._score);
		
		// filter out duplicates
		const response = candidates.filter((value, index, self)=>self.indexOf(value) === index);
		logger.info(`candidates filtered ${response.length}`)
		return response.slice(0,4); // output top 3 results
	};

	async train(bestResponse, ct, tags) {
		if (ct == "block"){
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
		const block = await this.findAllFromCollection('block');
		const forum = await this.findAllFromCollection('forum');

		fs.writeFileSync(filename, JSON.stringify({block, forum}));
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

	async restore(backup_file) {
		const items = require(backup_file);
		this.addToCollection(items.forum, 'forum');
		this.addToCollection(items.block, 'block');
	}

	async restoreCourse(courseCode){
		const dirname = '../data/backups/';
		const filename = `${dirname}${courseCode}.json`;
		const items = require(filename);
		this.addToCollection(items.forum, 'forum');
		this.addToCollection(items.block, 'block');
	}
};

