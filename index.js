const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: [
        'http://localhost:3000',
        "http://bimtian.org"
      ],
      optionsSuccessStatus: 200,
      credentials: true,
      methods: ['GET,PUT,POST,DELETE,UPDATE,OPTIONS'],
      exposedHeaders: ['set-cookie'],
}));

app.use('/assets/',express.static('assets')); 

//external route
app.use('/api/v1/auth', require('./routes/authRoute'));
app.use('/api/v1/student', require('./routes/studentRoute'));
app.use('/api/v1/external', require('./routes/externalRoute'));

app.get('/', (req, res)=>{
    res.send('Marine Student Database Is Running Successfully')
});

app.listen(port, ()=>{
    console.log(`server is running at port ${port}`)
});