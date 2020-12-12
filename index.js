const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { MongoClient } = require("mongodb");

const uri = process.env.db_uri
console.log(uri);
// use the express-static middleware
//app.use(express.static("public"));



express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res) {
     res.send('libre db');
  })
  .get('/libre/:numOfRecords', async function (req, res) {
       const client = new MongoClient(uri, { useUnifiedTopology: true });
       await client.connect();

       const database = client.db('nightscout3');
       const collection = database.collection('libre');

       // Query for a movie that has the title 'Back to the Future'
       const query = { BlockBytes: { $exists: true } };
       const cursor = await collection.aggregate([
         { $match: query },
         { $sample: { size: 2 } },
      
        ]);

      const movie = await cursor.next();

      return res.json(movie);

    try {
    } catch(err) {
      console.log(err);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))


