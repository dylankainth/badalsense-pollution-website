const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;

exports.handler = async (event, context) => {
    let client;

    try {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        
        const collection = client.db("pollution").collection("sensordata");

        const query = {
            reported_at: {
                $gt: Math.floor(Date.now() / 1000) - 5 * 60 * 60 // last 5 hours
            }
        };
        
        const result = await collection.find(query).sort({reported_at: -1}).toArray();

        // Close the connection
        await client.close();

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (err) {
        if (client) {
            await client.close();
        }
        return { statusCode: 500, body: err.toString() };
    }
};
