const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

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