const express = require('express');
const mongodb = require('mongodb');
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'database'

const router = express.Router();

// Get Posts
router.get('/', async (req, res) => { // `/` refers to `/api/posts/`
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

// Add Post
router.post('/', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
});

// Delete Post
router.delete('/:id', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    res.status(200).send();
});

async function loadPostsCollection() {
    const client = await mongodb.MongoClient.connect(
        dbUrl, { useNewUrlParser: true }
    );
    return client.db(dbName).collection('posts');
}

module.exports = router;
