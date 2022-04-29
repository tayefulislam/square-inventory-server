const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express()


// middleware  


app.use(cors())
app.use(express.json())



// apis

app.get('/', (req, res) => {
    res.send('server is runing')
})

app.listen(port,
    console.log('server is runnig ar ', port)
)