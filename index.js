const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan');
const bodyParser = require('body-parser');



const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/jwt', { useCreateIndex: true, useNewUrlParser: true })
    .then(re => console.log("Connected to DB"))
    .catch(err => console.log(err));

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/', require('./routes/api'));


app.listen(port, () => console.log("server is running on port " + port));