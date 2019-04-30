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
		this.backupQuiz();
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
	scoreQuizQuestion (tags, c) {
		const tagNames = tags.map(x => x.name);
		let score = 0.0;
		for (const t of c.tags) {
			if (tagNames.includes(t.name)) {
				score += t.thetha;
			}
		}
		logger.info(c)
		return score;
	}

	async getQuizQuestions(tags, courseCode) {
		const query = {
			courseCode: {
				$eq: courseCode
			}
		};
		let candidates = await this.search(query, 'quiz');
		candidates = candidates.map(x => {
			return {
				...x,
				'_score': this.scoreQuizQuestion(tags, x)
			}
		})
		// sort by score
		candidates = candidates.sort((a, b) => b._score - a._score);
		return candidates;

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
	 * Given a tag, will search all forum questions
	 * for objects containing the specified tag and 
	 * returns them in a array. 
	 */
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
	
	/*
	 * Given a tag and collection will search all objects
	 * under the collection for objects containing the specified
	 * tag. Returns the result in a array. 
	 */
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
	 * Given a course will search through the block and forum
	 * collections for objects tagged as belonging
	 * to the specified course. Returns a object
	 * of 2 arrays, block and forum denoting the results from 
	 * each of the collections. 
	 */
	async findAllByCourseCode(courseCode) {
		const block = await this.findByCourseCode(courseCode, 'block');
		const forum = await this.findByCourseCode(courseCode, 'forum');

		return { block, forum };
	};
	
	/*
	 * Given a collection will return a unique list of 
	 * tags that appear in the given collections objects.
	 */
	async getUniqueTagsFromCollection(collectionName) {
		const collection = this.dbConn.collection(collectionName);
		return await collection.distinct("tags.name");
	};
	
	/*
	 * Returns a unique list of 
	 * tags that appear in the grouped, tf-idf-block and forum collections
	 */
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
	 * Backups a single course to a json file
	 */
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

	/*
	 * Backups quiz data into a json file
	 */
	async backupQuiz() {
		const dirname = '../data/backups/';
		const filename = `${dirname}quiz_backup.json`;
		try {
			fs.mkdirSync(dirname, {recursive: true});
		} catch (err){
			console.log(err);
		}
		const questions = await this.findAllFromCollection('quiz');
		fs.writeFileSync(filename, JSON.stringify({ questions }));
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

	/*
	 * restores course data from a backup file
	 * assumes database is empty.
	 */
	async restoreCourse(courseCode){
		const dirname = '../data/backups/';
		const filename = `${dirname}${courseCode}.json`;
		const items = require(filename);
		this.addToCollection(items.forum, 'forum');
		this.addToCollection(items.block, 'block');
	}
};

