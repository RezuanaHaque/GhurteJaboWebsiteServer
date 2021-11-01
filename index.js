const express = require("express")
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p1pde.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run() {
    try {
        await client.connect();
        //   console.log('connectedd');
        const database = client.db("ghurte_jabo");
        const placesCollection = database.collection("places");
        const foundPlacesCollection = database.collection("yourorders");
        const manageOrderCollection = database.collection("manageOrder");

        // get api of places(destination)
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find({});
            const places = await cursor.toArray();
            // console.log(places);
            res.send(places)
        })
        app.post('/places', async (req, res) => {
            const service = req.body;
            // console.log("post hitted",service);
            const result = await placesCollection.insertOne(service);
            res.json(result)

        })
        //post api or manage order route
        app.post('/manageOrder', async (req, res) => {
            const service = req.body;
            // console.log("post hitted", service);
            const result = await manageOrderCollection.insertOne(service);
            res.json(result)
        })


        app.get('/manageOrder', async (req, res) => {
            const cursor = manageOrderCollection.find({});
            const manageOrder = await cursor.toArray();
            // console.log(places);
            res.send(manageOrder)
        })

        // get single service 
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('hitting');
            const query = { _id: ObjectId(id) };
            const service = await placesCollection.findOne(query)
            res.json(service)
        })
        
        // delete 
        app.delete('/manageOrder/:id',async(req,res)=>{
            const id=req?.params?.id;
            const query = { _id: (id.toString()) };
            const result = await manageOrderCollection.deleteOne(query);
            res.json(result)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("hitting the port")
})

app.listen(port, () => {
    console.log('running genuis server on ', port);
})
