const DB = require('./db');

module.exports = class Bot {
	constructor() {
		this.version = '0.0';
		this.db = new DB('mongodb://root:example@localhost:27017','database');
		// Async connection
		this.db.connect().then(_=>{
			// you can submit documents like this
			this.db.dump([
				{
					type: "text",
					content: "hi it's me!"
				}
			]);

			this.db.forum.insertMany(/*array of forum objects*/);
			this.db.block.insertMany(/*array of block objects*/);
			this.db.group.insertMany(/*array of group objects*/);

		})
	}
	query(msg) {
		return "lol i dunno";
	}
};
