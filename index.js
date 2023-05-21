const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb://0.0.0.0:27017/";

// const uri = "mongodb+srv://<username>:<password>@cluster0.qawsvmr.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const toyCollection = client.db("toyDB").collection("toys");

    // get all data form database
    app.get("/alltoy", async(req ,res)=>{
        const cursor = toyCollection.find();
        const result = await cursor.limit(20).toArray();
        res.send(result);
    })

    // app.get("/toys", async(req ,res)=>{
    //   const query = {price: price};
    //   const result = await toyCollection.find(query).sort({ price: 1 }).toArray();
    //   console.log(result);
    // })

    // get specific data by id
    app.get("/toy/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    })

    // app.get("/search/:text", async(req, res)=>{
    //   const text = req.params.text;
    //   console.log(text);
    //   const query = { name: { $regex: text, $options: 'i' } }; 
    //   console.log(query);
    //   const result = await toyCollection.find(query).toArray();
    //   console.log(result);
    //   res.send(result);
    // })
    
    //  delete specific data by id
    app.delete("/delete/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toyCollection.deleteOne(query);
      res.send(result)
    })

    // insert a data
    app.post("/insert", async(req, res)=>{
      const data = req.body;
      const result = await toyCollection.insertOne(data);
      res.send(result)
    })
    
    // get my toys
    app.get("/toys", async (req, res) => {
      console.log("me", req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
      }
      const result = await toyCollection.find(query).toArray();
      console.log("data" ,result);
      res.send(result);
    });

    app.patch('/update/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateToy = req.body;
      console.log(updateToy);
      const updateDoc = {
        $set: {
          price: updateToy.price,
          availableQuantity:  updateToy.availableQuantity,
          detailDescription : updateToy.detailDescription
        },
      };
      const result = await toyCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res)=>{
    res.send("server is runing");
})

app.listen(port, ()=>{
    console.log("server is runing on port", port);
})
