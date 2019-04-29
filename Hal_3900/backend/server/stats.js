const updateQuizStats = async (db, course, searchTags) => {
    if (!db.connected){
        await db.connect();
    }

    let result = await db.findByCourseCode(course, "courseStats");
    if (result.length === 0) {
        await makeNewFrequencyCount(db, course);
        result = await db.findByCourseCode(course, "courseStats");
    }
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
    db.dbConn.collection("courseStats").updateOne(
        {courseCode : course},
        {$set : {
                quizCounts: quizCounts,
                quizTotal: quizTotal + 1
            }
        });
    // console.log(await db.findByCourseCode(course, "courseStats"));
};

updateQueryStats = async (db, course, searchTags) => {
    if (!db.connected){
        await db.connect();
    }

    let result = await db.findByCourseCode(course, "courseStats");
    if (result.length === 0) {
        await makeNewFrequencyCount(db, course);
        result = await db.findByCourseCode(course, "courseStats");
    }
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
    db.dbConn.collection("courseStats").updateOne(
        {courseCode : course},
        {$set : {
                queryCounts: queryCounts,
                queryTotal: queryTotal + 1
            }
        });
    // console.log(await db.findByCourseCode(course, "courseStats"));
};

const countMissedQuery = async (db, course) => {
    let result = await db.findByCourseCode(course, "courseStats");
    if (result.length === 0) {
        await makeNewFrequencyCount(db, course);
        result = await db.findByCourseCode(course, "courseStats");
    }
    const missedQuery = result[0].missedQuery;
    // update in db
    db.dbConn.collection("courseStats").updateOne(
        {courseCode : course},
        {$set : {missedQuery: missedQuery + 1}}
    );
    // console.log(await db.findByCourseCode(course, "courseStats"));
};

/*
 * Create a new course frequency counter
 * Assumes one does not already exist for the course
 */
const makeNewFrequencyCount = async (db, courseCode) => {
    if (!db.connected){
        await db.connect();
    }

    const newObject = {
        courseCode,
        "queryCounts": [], // count times keyword present in query
        "quizCounts": [], // count times keyword present in quiz request
        "queryTotal": 0, // count total times bot asked questions
        "missedQuery": 0, // count total times bot didn't understand
        "quizTotal": 0  // count total times bot asked for quiz
    };
    await db.addToCollection([newObject], "courseStats");
};

module.exports = {updateQuizStats, updateQueryStats, countMissedQuery};
