const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;
const admin = require("firebase-admin");
const serviceAccount = require("./travelease-service.json");

// middleware
app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
    const bookingsCollection = db.collection("bookings");

    // get all cars
    app.get("/all-cars", async (req, res) => {
      try {
        const result = await carsCollection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // get latest 6 cars
    app.get("/latest-cars", async (req, res) => {
      try {
        const result = await carsCollection
          .find({})
          .sort({ createdAt: -1 })
          .limit(6)
          .toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // get car details
    app.get("/details-car/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid ID format" });
        }
        const result = await carsCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });




    // add vehicles
    app.post("/all-cars", async (req, res) => {
      try {
        const data = req.body;
        const result = await carsCollection.insertOne(data);
        res.send({ success: true, result });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    


    // my vehicles
    app.get("/my-cars", async (req, res) => {
      const email = req.query.email;
      const result = await carsCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    // post booking data
    app.post("/bookings/:id", async (req, res) => {
      try {
        const data = req.body;
        const id = req.params.id;
        const result = await bookingsCollection.insertOne(data);
        res.send(result);
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
