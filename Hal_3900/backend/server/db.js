const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const logger = require('log4js').getLogger('Database');
const dataExtraction = require('./data_extraction/data_extraction.js');
logger.level = 'info';

module.exports = class DB {

	constructor () {
		let url = 'mongodb://localhost:27017';
		if (process.env.PROD) url = 'mongodb://database:27017';
		this.dbConn = null;
		this.dbUrl = url;
		this.dbName = 'database';
	}
	
	/*
	 * Connects to the database server
	 */
	async connect() {
		const mongoConfig = {
			useNewUrlParser: true
		};
		const client = await MongoClient.connect(this.dbUrl,mongoConfig);
		logger.info("Connected to database successfully");
		this.dbConn = client.db(this.dbName);
		//logger.info(`connect to:${dbConn}`)
	}
	
	/*
	 * Adds a array of objects to the database under the 
	 * specified collection, if collection is not supplied it defaults to 
	 * the documents collection
	 */
	async addToCollection(objects, collection) {
		if (collection === undefined) collection = 'documents';
		const collectionRef = this.dbConn.collection(collection);
		const res = await collectionRef.insertMany(objects);
		logger.info(`Inserted ${res.insertedCount} objects into collection ${collection}`);
		return res;
	}
	
	/*
	 * Given a mongodb search object and a target collection
	 * returns a array of matching objects
	 */
	async search(obj, collection) {
		if (collection === undefined) collection = 'documents';
		const collectionRef = this.dbConn.collection(collection);
		let results = [];
		results = await collectionRef.find(obj).toArray();
		return results;
	}

	/*
	 * Given a mongodb search object and a target collection
	 * deleted the first matching object
	 */
	async delete(obj, collection) {
		if (collection === undefined) collection = 'documents';
		const collectionRef = this.dbConn.collection(collection);
        await collectionRef.deleteOne(obj)
	}

	/*
	 * Given a set of pages to scrape, runs the data extraction
	 * program on them to generate a set of data which is automatically
	 * appended to the database
	 * 
	 * pagesToScrape must be a js object formatted as per spec in wiki
	 */
	async runDataExtraction (pagesToScrape) {
		if (!this.connected)
			await this.connect();

		 await dataExtraction.getDataToDb(pagesToScrape, this);
	}
	
	/*
	 * Checks if the database is empty and if so populates it with the 
	 * last backed up dump of data. 
	 * Relies on the database having already been connected to. 
	 */
	async initData () {
		// this.delete({courseCode: "COMP1521"}, "courseStats");
		let knownCollections = await this.dbConn.listCollections().toArray();
		knownCollections = knownCollections.map(x=>x.name);
		if (knownCollections.indexOf("forum") !== -1) {
			logger.info(`Detected collections, skipping init step`);
			return;
		}

		const filename = '../data/db_backup.json';
		if (fs.existsSync(filename)){
			logger.info(`Restoring data from backup`);
			this.restore(filename);
			return;
		}

		logger.error("No data loaded in the DB and no backup file. Add some course data");
	};
	

	/*
	 * get quiz questions
	 */
	async getQuizQuestions(course, searchTags) {
		console.log(course);
		// find all quiz questions for the course
		let candidates = await this.findByCourseCode(course, 'quiz');

		// if keywords input, find all quiz questions matching them
		// item.tags[i].name
		if (searchTags.length > 0) {
			candidates = candidates.filter(item => {
				// check if any tags on the candidate match the searchTags
				return item.tags.some((tag) => {
					return searchTags.indexOf(tag.name.toLowerCase()) >= 0;
				});
			})
		}
		// get stats or make if not exists
		await this.updateQuizStats(course, searchTags);

		return candidates;
	}

	async updateQuizStats(course, searchTags){
		let result = await this.findByCourseCode(course, "courseStats");
		if (result.length === 0) {
			await this.makeNewFrequencyCount(course);
			result = await this.findByCourseCode(course, "courseStats");
		}
		console.log(result[0]);
		const quizCounts = result[0].quizCounts;
		const quizTotal = result[0].quizTotal;
		// update count for these tags
		searchTags.forEach(tag => {
			const tagIndex = quizCounts.findIndex(item => item.tag === tag);
			if (tagIndex === -1){
				// create new
				const count = 1;
				quizCounts.push({tag , count});
			} else {
				const count = quizCounts[tagIndex].count + 1;
				quizCounts.splice(tagIndex, 1, {tag, count});
			}
		});
		// update in db
		this.dbConn.collection("courseStats").updateOne(
			{courseCode : course},
			{$set : {
					quizCounts: quizCounts,
					quizTotal: quizTotal + 1
				}
			});
	}

	async updateQueryStats(course, searchTags){
		let result = await this.findByCourseCode(course, "courseStats");
		if (result.length === 0) {
			await this.makeNewFrequencyCount(course);
			result = await this.findByCourseCode(course, "courseStats");
		}
		console.log(result[0]);
		const queryCounts = result[0].queryCounts;
		const queryTotal = result[0].queryTotal;
		// update count for these tags
		searchTags.forEach(tag => {
			const tagIndex = queryCounts.findIndex(item => item.tag === tag);
			if (tagIndex === -1){
				// create new
				const count = 1;
				queryCounts.push({tag , count});
			} else {
				const count = queryCounts[tagIndex].count + 1;
				queryCounts.splice(tagIndex, 1, {tag, count});
			}
		});
		// update in db
		this.dbConn.collection("courseStats").updateOne(
			{courseCode : course},
			{$set : {
					queryCounts: queryCounts,
					queryTotal: queryTotal + 1
				}
			});
	}

	/*
	 * Create a new course frequency counter
	 * Assumes one does not already exist for the course
	 */
	async makeNewFrequencyCount(courseCode){
		const newObject = {
			courseCode,
			"queryCounts": [], // count times keyword present in query
			"quizCounts": [], // count times keyword present in quiz request
			"queryTotal": 0, // count total times bot asked questions
			"missedQuery": 0, // count total times bot didn't understand
			"quizTotal": 0  // count total times bot asked for quiz
		};
		await this.addToCollection([newObject], "courseStats");
	}


	/*
	 * Given a collection name will return a array of all 
	 * objects under that collection
	 */
	async findAllFromCollection(collectionName) {
		const collection = this.dbConn.collection(collectionName);
		let results = [];
		const cursor = await collection.find({});
		results = await cursor.toArray();
		cursor.close();
		return results;
	};

	/*
	 * Given a course and collection will search all objects
	 * under the collection for objects tagged as belonging
	 * to the specified course. Returns the result in a array. 
	 */
	async findByCourseCode(courseCode, collectionName) {
		const collection = this.dbConn.collection(collectionName);
		// find all objects where tags contains an array elem with name = tag
		const cursor = await collection.find({ courseCode: courseCode });
		const results = await cursor.toArray();
		cursor.close();
		return results;
	};
	
	/*
	 * Backups the current database into a json file.
	 */
	async backup() {
		const filename = '../data/db_backup.json';
		const block = await this.findAllFromCollection('block');
		const forum = await this.findAllFromCollection('forum');
		const courses = await this.findAllFromCollection('courses');
		const quiz = await this.findAllFromCollection('quiz');

		fs.writeFileSync(filename, JSON.stringify({block, forum, courses, quiz}));
	}

	/*
	 * restores database from a backup file
	 * assumes database is empty.
	 */
	async restore(backup_file) {
		const items = require(backup_file);
		this.addToCollection(items.forum, 'forum');
		this.addToCollection(items.block, 'block');
		this.addToCollection(items.courses, 'courses');
		this.addToCollection(items.quiz, 'quiz');
	}

};

