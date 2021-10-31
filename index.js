//import
const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
//app init
const app = express();
//middleware
app.use(cors());
app.use(express.json());
//port declare
const port = process.env.PORT || 5000;
//add monogodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.be8dg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travelerz");
    const servicesCollection = database.collection("services");
    const usersCollection = database.collection("users");
    //get api for load services
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //get api for single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    //post services
    app.post("/services", async (req, res) => {
      const services = req.body;
      const result = await servicesCollection.insertOne(services);
      console.log("hit the post", services);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      console.log("hit the post", users);
      res.send(result);
    });
    //get users
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    //delete api
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.json(result);
    });
    //get api with email
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

//root api
app.get("/", (req, res) => {
  res.send("Hello World!");
});
//listen api
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
