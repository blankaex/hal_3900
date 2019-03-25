const DB = require('./db');
const query = require('./db_query');

module.exports = class Bot {
	constructor() {
		this.version = '0.0';
		this.db = new DB('mongodb://root:example@localhost:27017','database');
		// Async connection
		this.db.connect().then(_=>{
			// you can submit documents like this
			// this.db.dump([
			// 	{
			// 		type: "text",
			// 		content: "hi it's me!"
			// 	}
			// ]);
			//
			// // Run INIT DATA here once established working
			console.log("Initialising db with data");
			this.db.initData();
			
		})
	}
	query(msg) {
		return "lol i dunno";
	}
};
