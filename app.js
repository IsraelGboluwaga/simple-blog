const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bluebird = require('bluebird');;
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = bluebird;
connectionString = 'mongodb://localhost:27017/becky-blog-api'
mongoose.connect(connectionString, { useNewUrlParser: true })
        .then((db) => {
            logger.info('Mongo Connection Established');

            // If the Node process ends, close the Mongoose connection
            process.on('SIGINT', () => {
                logger.error('Mongoose default connection disconnected through app termination');
                process.exit(0);

            });
        })
        .catch(err => {
            logger.error(`Mongo Connection Error : ${err}`);
            process.exit(1);
        });

app.use(cors());
app.use(helmet());
app.disable('x-powered-by');

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use('/users', usersRouter);
app.use('/posts', postsRouter);

const port = process.env.PORT || 7900;
app.listen((port) => {
    console.log(`App listening on ${port}`);
});
module.exports = app;
