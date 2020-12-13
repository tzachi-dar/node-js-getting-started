const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { MongoClient } = require("mongodb");

const uri = process.env.db_uri
const password = process.env.password
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
  .get('/pass/:password/libre/:numOfRecords', async function (req, res) {
    try {
       console.log(req.params.password);
       if(req.params.password != password) {
           res.send('wrong passwrod');
           return;
       }
       limit = parseInt(req.params.numOfRecords);
       if(limit > 20) {
           limit = 20;
       }
       const client = new MongoClient(uri, { useUnifiedTopology: true });
       await client.connect();

       const database = client.db('nightscout3');
       const collection = database.collection('libre');

       // Query for a movie that has the title 'Back to the Future'
       const query = { BlockBytes: { $exists: true } };

        var mysort = { CaptureDateTime: -1 };
        database.collection("libre").find(query).sort(mysort).limit(limit).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            return res.json(result);
            db.close();
        });


    } catch(err) {
      console.log(err);
      res.send(error);
    }
    finally {
      // Ensures that the client will close when you finish/error
      if(client) {
          await client.close();
      }
    }
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))


