const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://aurthohinparvez:2tdBD4q1zQnAt1ug@cluster0.4scykru.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const productCollection = client.db("products").collection("product");
        const userCollection = client.db("userCollection").collection("user")

        app.get("/product", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
          });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            
            if (!ObjectId.isValid(id)) {
              return res.status(400).send('Invalid ID');
            }
          
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
          
            if (!result) {
              return res.status(404).send('Student not found');
            }
          
            res.send(result);
          });

        app.post("/product", async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
          });


          app.put("/product/:id", async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
              $set: {name : user.name, description : user.description, price: user.price,category:user.category,image:user.image},
            };
            const result = await productCollection.updateOne(filter,updateDoc,options);
            res.send(result);
          });

        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
          });

          app.post("/user", async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
          });

        app.get("/user", async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
          });

          app.get("/admin/:email", async (req, res) => {
            try {
                const email = req.params.email;
                const user = await userCollection.findOne({ email: email });
        
                if (user) {
                    const isAdmin = user.role === "admin";
                    res.send({ admin: isAdmin });
                } else {
                    // If no user is found with the specified email
                    res.status(404).send({ message: "User not found" });
                }
            } catch (error) {
                console.error("Error:", error);
                res.status(500).send({ message: "Internal Server Error" });
            }
        });
        
      
          app.put("/user/admin/:email", async (req, res) => {
            const email = req.params.email;
        
            // Allow unauthenticated requests (for educational purposes only)
            // In a real-world scenario, you should implement proper authentication and authorization logic here.
        
            // Your server-side logic to make a user an admin goes here...
        
            const filter = { email: email };
            const updateDoc = {
                $set: { role: "admin" },
            };
        
            const result = await userCollection.updateOne(filter, updateDoc);
        
            if (result.modifiedCount > 0) {
                res.send({ modifiedCount: result.modifiedCount, message: "Successfully made an admin" });
            } else {
                res.status(403).send({ message: "Failed to make an admin" });
            }
        });
        
        
    }
    finally{}
}

run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("Alhamdulliah Your server is Running");
  });
  app.listen(port, () => {
    console.log("Alhamdullilah Your server is Start");
  });


