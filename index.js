const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mav3s.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("computer_parts");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    // const reviewsCollection = database.collection("reviews");
    const reviewsCollection = client.db("computer_parts").collection("reviews");
    const userCollection = client.db("computer_parts").collection("users");

    console.log("Database connected");

    // GET products API
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log("load user with id: ", id);
      //   const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne();
      res.send(product);
    });

    //post
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // GET orders API with matched email
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });
    // GET all orders API
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // POST order API
    app.post("/orders", async (req, res) => {
      const order = req.body;
      console.log("hitting the post", order);
      const result = await orderCollection.insertOne(order);
      res.send(result);

      //make admin api
      app.get("/users", async (req, res) => {
        const query = {};
        const cursor = userCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
      });
      //get review
      app.get("/reviews", async (req, res) => {
        const cursor = reviewsCollection.find({});
        const reviews = await cursor.toArray();
        res.send(reviews);
      });
      // post  Review
      app.post("/reviews", async (req, res) => {
        const review = req.body;
        console.log("hitting the post", review);
        const result = await reviewsCollection.insertOne(review);
        res.send(result);
      });
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Par-T-ake!");
});

app.listen(port, () => {
  console.log(`par-T-ake app listening on port ${port}`);
});
