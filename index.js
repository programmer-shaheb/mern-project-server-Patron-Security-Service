const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const port = process.env.PORT || 5055;
const ObjectId = require("mongodb").ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ly73p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

client.connect((err) => {
  const reviewCollection = client.db("securityService").collection("reviews");
  const adminCollection = client.db("securityService").collection("admins");
  const serviceCollection = client.db("securityService").collection("services");
  const orderCollection = client.db("securityService").collection("orders");

  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ makeAdmin: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });

  app.post("/addService", (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/services", (req, res) => {
    serviceCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/services/:id", (req, res) => {
    const findService = req.params.id;
    serviceCollection
      .find({ _id: ObjectId(findService) })
      .toArray((err, items) => {
        res.send(items);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    const deleteProduct = req.params.id;
    serviceCollection
      .deleteOne({ _id: ObjectId(deleteProduct) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/allOrders", (req, res) => {
    orderCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.patch("/update/:id", (req, res) => {
    orderCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { status: req.body.status },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  app.get("/orderInfo", (req, res) => {
    const email = req.query.email;
    orderCollection.find({ email: email }).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(port, () => console.log(`Listening To Port ${port}`));
