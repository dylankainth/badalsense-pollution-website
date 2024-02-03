// make a netlify function that outputs data from the last 5 hours
//

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event, context) => {
    try {
        await client.connect();
        const collection = client.db("moduLo1").collection("timeseriesdata");

        // we're querying for the last 5 hours
        // the database has a reported_at field with an epoch time
        const query = {
            reported_at: {
                $gt: Math.floor(Date.now() / 1000) - 5 * 60 * 60
            }
        }
        //const result = await collection.find(query).toArray();
        // sort by reported_at in descending order
        const result = await collection.find(query).sort({reported_at: -1}).toArray();

        return {
        statusCode: 200,
        body: JSON.stringify(result),
        };
    } catch (err) {
        return { statusCode: 500, body: err.toString() };
    }
}