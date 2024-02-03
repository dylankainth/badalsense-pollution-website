// make a netlify function that takes in json input and posts to a mongodb

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event, context) => {
    try {
        await client.connect();
        const collection = client.db("moduLo1").collection("timeseriesdata");
        const result = await collection.insertOne(JSON.parse(event.body));
        return {
        statusCode: 200,
        body: JSON.stringify(result),
        };
    } catch (err) {
        return { statusCode: 500, body: err.toString() };
    }
};

