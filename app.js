const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const fs = require('fs');

app.use(cors());
app.use(express.json({limit: '50mb'}));

const dbName = "rest"
async function main() {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    return db.collection('shops');
    // const collection = db.collection("documents");

    // // the following code examples can be pasted here...

    // return "done.";
}

main().then(client => {
    app.post('/stores', (req, res) => {
        const store = req.body.store;
        const cursor = client
            .findOne({
                "name": store,
            })
            .then(results => {
                return res.status(200).json(results);
            })
            .catch(err => {
                return res.status(400).json(JSON.stringify(err));
            })
    })

    app.get('/stores', (req, res) => {
        const cursor = client
            .find({}, {"name": 1}).toArray()
            .then(results => {
                const final = results.map((x) => x.name);
                return res.status(200).json(final);
            })
            .catch(err => {
                return res.status(400).json(JSON.stringify(err));
            })
    })
});

app.post('/svg', (req, res) => {
    const svgFile = req.body.svgURI;
    res.sendFile(__dirname + '/svg/' + svgFile);
})




// {
//     "_id" : ObjectId("60f1acf10264ee51e92dd1e4"),
//     "name" : "next",
//     "svgURI" : "next.svg",
//     "svgwidth" : 1024,
//     "svgheight" : 1024,
//     "products" : {
//             "apple" : {
//                     "price" : 1.49,
//                     "x" : 10,
//                     "y" : 300
//             },
//             "orange" : {
//                     "price" : 2.99,
//                     "x" : 400,
//                     "y" : 20
//             }
//     }
// }

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// main()
//     .then(console.log)
//     .catch(console.error)
//     .finally(() => client.close());


app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port " + (process.env.PORT || 5000));
})