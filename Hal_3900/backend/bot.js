const DB = require('./db');

module.exports = class Bot {
	constructor() {
		this.version = '0.1'
		let url = 'mongodb://localhost:27017'
		if (process.env.PRODUCTION) url = 'mongodb://database:27017'
		console.log(">>> ",url)
		this.db = new DB(url,'database')
		// Async connection
		this.db.connect().then(_=>{
			// you can submit documents like this
			this.db.dump([
				{
					type: "text",
					content: "hi it's me!"
				}
			])
		})
	}
	query(msg) {
		return "lol i dunno"
	}
}
