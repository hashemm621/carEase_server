const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// encode name/password
const dbName = process.env.DbName;
const dbPassword = process.env.DbPassword;

const uri = `mongodb+srv://${dbName}:${dbPassword}@simple-crud-2.ahrgsbv.mongodb.net/?appName=simple-crud-2`;

// create mongoDb client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("carEase is running on server....");
});

// run program function

async function run() {
  try {
    // connect to the client
    await client.connect();

    // created at database
    const db = client.db("carsEase-DB");
    const carsCollection = db.collection("cars");

    // get all cars
    app.get("/all-cars", async (req, res) => {
      try {
        const result = await carsCollection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
          console.log(result);
        res.send(result);
        console.log(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`careEase is listening on port ${port}`);
});
