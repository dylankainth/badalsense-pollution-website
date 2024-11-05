const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;

exports.handler = async (event, context) => {
    let client;

    try {
        const incomingData = JSON.parse(event.body);
        // add reported_at field to the incoming data
        incomingData.reported_at = Math.floor(Date.now() );
        
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        
        const collection = client.db("pollution").collection("sensordata");
        const result = await collection.insertOne(incomingData);

        // Close the connection
        await client.close();

        return {
            statusCode: 200,
            body: "OK",
        };
    } catch (err) {
        if (client) {
            await client.close();
        }
        return { statusCode: 500, body: err.toString() };
    }
};
