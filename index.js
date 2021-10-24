const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const port = 8080;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

//mongodb 
const uri = "mongodb+srv://myaddmin1:drR0OlqhLqZgnDFx@cluster0.bug5j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("firstbd");
      const databasecolection = database.collection("userinfo");
      // create a document to insert
      //get api
      app.get("/users",async(req,res)=>{
        //courser means database ar name and ki kormu seta ex: find kormu
        const cursor = databasecolection.find({});
        //cursor theke ja pamu setake arry te convert korsi
        const users = await cursor.toArray();
        //and data ke send kore dccci
        res.send(users)
      });
      //post api
      app.post("/users", async (req,res)=>{
        const newuser=req.body;
     //   res.send(JSON.stringify(newuser))
         const result = await databasecolection.insertOne(newuser);
         console.log(`A document was inserted with the _id: ${result.insertedId}`);
         res.json(result)
    });
    //delete api
          app.delete("/users/:id", async(req,res)=>{
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result= await databasecolection.deleteOne(query);
            console.log(result);
            res.json(result)
          })

          //update api for query
          app.get("/users/:id",async(req,res)=>{
            const id=req.params.id;
            const query = { _id: ObjectId(id) };
            const result= await databasecolection.findOne(query);
            console.log(id);
            res.send(result)
          })

          //update api when update submit
          app.put("/users/:id",async(req,res)=>{
            const id=req.params.id;
            const updateData=req.body;
            console.log("hetting ",id,updateData);
            const filter = { _id:ObjectId(id) };
            const options = { upsert: true };
               // create a document that sets the plot of the movie
             const updateDoc = {
                $set: {
                  name: updateData.name,
                  email:updateData.email
                },
              };
              const result = await databasecolection.updateOne(filter, updateDoc, options)
              res.json(result)
          })

    } finally {
      //await client.close();
    }
  }
  run().catch(console.dir);




// const users=[
//                         {id:"1",name:"nazim",email:"nazim@gmail.com"},
//                         {id:"2",name:"sokina",email:"nazim@gmail.com"},
//                         {id:"3",name:"biplop",email:"nazim@gmail.com"},
//                         {id:"4",name:"asad",email:"nazim@gmail.com"}
//                         ]


// app.get("/users",(req,res)=>{
//     res.send(users)
// })
// app.post("/users",(req,res)=>{
//     const newuser=req.body;
//     newuser.id=users.length+1;
//     users.push(newuser)
//  //   res.send(JSON.stringify(newuser))
//  res.json(newuser)
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})