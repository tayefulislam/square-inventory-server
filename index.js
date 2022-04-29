const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


// middleware  


app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fgmis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {


    try {

        await client.connect()

        const itemsCollection = client.db("squareInventory").collection("items");


        app.get('/items', async (req, res) => {
            const query = {}
            const result = await itemsCollection.find(query);
            res.send(result)
        })


    }
    finally {

    }

}


run().catch(console.dir)



// apis

app.get('/', (req, res) => {
    res.send('server is runing')
})

app.listen(port,
    console.log('server is runnig ar ', port)
)