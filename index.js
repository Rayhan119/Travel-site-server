//import
const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
//app init
const app = express();
//middleware
app.use(cors());
app.use(express.json());
//port declare
const port = 5000;
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
    //get api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
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