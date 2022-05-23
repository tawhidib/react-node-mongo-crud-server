const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = 8080;

// middlewares ....
app.use(cors());
app.use(express.json());

//////////////////////////////////////////////////////
// mongodb access user name : tawhidib
// mongodb access password: OE6JoGxNge2IJya8

app.get("/", (req, res) => {
  res.send("app is running");
});

const uri =
  "mongodb+srv://tawhidib:OE6JoGxNge2IJya8@cluster0.jptox.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const crudPractice1 = client.db("crudPractice1");
    const usersCollection = crudPractice1.collection("users");

    // GET: All Users

    app.get("/getAllUser", async (req, res) => {
      const findAllUser = usersCollection.find({});
      const allUsers = await findAllUser.toArray();
      // const allUserRes = allUsers.map((user) => {
      //   userName: user.name;
      // });

      res.send(allUsers);
    });

    // GET: Single User Detais
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollection.findOne(query);

      res.send(user);
    });

    // POST: Add User API
    app.post("/addUser", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      console.log("from -- add user api ");
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // DELETE: delete an user

    app.delete("/deleteUser/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });

    // UPDATE: update an user info

    app.put("/updateUser/:id", async (req, res) => {
      const id = req.params.id;
      const updateUserInfo = req.body;
      console.log(updateUserInfo);
      const filter = { _id: ObjectId(id) };

      const updateDoc = {
        $set: {
          name: updateUserInfo.name,
          address: updateUserInfo.address,
          emial: updateUserInfo.eamil,
          password: updateUserInfo.password,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server running on port: ", port);
});
