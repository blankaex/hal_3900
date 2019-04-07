const DB = require('./db.js');
let db = new DB('mongodb://localhost:27017','database');

async function main(){
    await db.connect();
    await db.initData();
    console.log(await db.getDataPoints(['pointer','c']))
}

main();
