const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uxoa3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err =>{
  const tourCollection = client.db('sunny_travel').collection('services');
  const orderCollection = client.db('sunny_travel').collection('orders');

    // post api 
    app.post("/services", (req,res) =>{
      tourCollection.insertOne(req.body).then((result) =>{
        res.send(result.insertedId);
      })
    });

  // get api 
   app.get('/services', async(req,res) =>{
    const services = await tourCollection.find({}).toArray();
    res.send(services);
  });

  // add order 
  app.post("/myorders", (req,res) =>{
    orderCollection.insertOne(req.body).then((result) =>{
      console.log(result);
      res.send(result);
    })
  });

  // get my orders
  app.get("/mybooking/:email",async (req,res) =>{
    console.log(req.params.email);
    const result = await orderCollection.find({email: req.params.email}).toArray();
    console.log(result);
  })


 app.get('/', (req, res) => {
  res.send('server is running')
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
});
