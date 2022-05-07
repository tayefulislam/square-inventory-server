const express = require('express');
const cors = require('cors');
require('dotenv').config()

const jwt = require('jsonwebtoken');


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();


// middleware  


app.use(cors())
app.use(express.json())


function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;


    if (!authHeader) {

        return res.status(401).send({ message: 'unauthrized access' })
    }


    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.Secret_Access_Token, (err, decoded) => {

        if (err) {

            return res.status(403).send({ message: 'Forbiden' })
        }
        req.decoded = decoded;

        next()


    })




}





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mabp5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {

        await client.connect();

        const itemsCollections = client.db("squareInventory").collection('items');



        app.post('/login', async (req, res) => {

            const email = req.body;

            const acceseToken = jwt.sign(email, process.env.Secret_Access_Token, {
                expiresIn: '1d'
            })

            res.send({ acceseToken })
            // console.log(email)
        })





        let cursor;
        let result;

        app.get('/items', async (req, res) => {

            const query = {};

            cursor = itemsCollections.find(query);

            result = await cursor.toArray()

            return res.send(result);


        })



        app.get('/itemlist', verifyJWT, async (req, res) => {

            const email = req.query.email;
            const emailDecoded = req.decoded?.email;

            console.log(emailDecoded)

            if (email === emailDecoded) {

                const query = { email: email };

                cursor = itemsCollections.find(query);

                result = await cursor.toArray()

                res.send(result);
            }


            else {
                res.status(403).send({ message: 'forbiden' })
            }




        })




        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id

            const query = { _id: ObjectId(id) }

            const result = await itemsCollections.findOne(query)

            res.send(result)
            // console.log(id)


        })

        app.get('/item/:trackid', async (req, res) => {
            const trackId = req.params.trackid
            const query = { trackId: trackId }


            const result = await itemsCollections.findOne(query)

            if (result) {
                res.send(result)
            }
            else {

                res.send([])

            }


            // console.log(result)
        })




        // delete item

        app.delete('/detele/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }

            // console.log(id)

            const result = await itemsCollections.deleteOne(query)

            res.send(result)


        })






        // add new item 

        app.post('/addnewitem', async (req, res) => {

            const newItem = req.body;

            const result = await itemsCollections.insertOne(newItem)
            res.send(result)



        })






        // quantity update
        app.post('/inventory/:id', async (req, res) => {
            const id = req.params.id;

            const quantity = req.body.newQuantity;

            const sold = req.body.newSold;



            // console.log(sold, 'line 139')

            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {

                    quantity: quantity,
                    sold: sold

                }

            }

            const result = await itemsCollections.updateOne(filter, updateDoc, options)

            // console.log(quantity)
            // console.log(sold)

            res.send(result)

        })



        // update a item 


        app.post('/update/:id', async (req, res) => {

            const id = req.params.id;

            const updatedItem = req.body;

            const filter = { _id: ObjectId(id) }

            const options = { upsert: true };


            // console.log(id, updatedItem)

            const updatedDoc = {
                $set: updatedItem
            }


            const result = await itemsCollections.updateOne(filter, updatedDoc, options)

            res.send(result)


        })






    }

    finally {


    }

}

run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('server is runnding')
})




app.listen(port, () => {
    console.log('port number', port)
})