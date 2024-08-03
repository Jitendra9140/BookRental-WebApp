
const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');

// MongoDB connection details
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const dbName = 'AtRent';       // Replace with your database name
const collectionName = 'books'; // Replace with your collection name

async function insertData() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Read JSON data from file
    const filePath = path.join(__dirname, 'data.json');
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    // Insert the JSON data array into the MongoDB collection
    const result = await collection.insertMany(jsonData.book);
    console.log(`${result.insertedCount} documents inserted`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Call the function to insert data
insertData();
