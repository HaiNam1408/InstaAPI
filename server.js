const express = require('express');
const path = require('path')
const logger = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dbConnect = require('./configs/dbConnect')
const initRoute = require('./routes')
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(cors());
app.use(logger('dev'));
dbConnect()
initRoute(app)

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})