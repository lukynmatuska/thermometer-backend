/**
 * The entry point of the Node.js app
 * @brief The entry point for bigger sites
 * @author Lukas Matuska
 * @version 1.0
 * @license Beerware
 */

// Configuration of global variable
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
    throw result.error;
}
global.CONFIG = {};
if (!process.env.CORS_OPTIONS) throw Error("Missing the environment variable CORS_OPTIONS");
global.CONFIG.CORS_OPTIONS = JSON.parse(process.env.CORS_OPTIONS);
if (!process.env.PORT) throw Error("Missing the environment variable PORT");
global.CONFIG.PORT = parseInt(process.env.PORT);
if (!process.env.REDIS) throw Error("Missing the environment variable REDIS");
global.CONFIG.REDIS = JSON.parse(process.env.REDIS);
if (!process.env.SESSION) throw Error("Missing the environment variable SESSION");
global.CONFIG.SESSION = JSON.parse(process.env.SESSION);

// Load the server lib (Express)
const express = require('express');
const app = express();

// load some libraries
const moment = require('./libs/moment');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
console.log(`CORS_OPTIONS: ${JSON.stringify(global.CONFIG.CORS_OPTIONS)}`);
app.use(cors(global.CONFIG.CORS_OPTIONS));

// Session handling
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

// Connect to the redis server
const redisClient = redis.createClient(global.CONFIG.REDIS.port, global.CONFIG.REDIS.host);
redisClient.on('error', console.error)
const store = new RedisStore({
    host: global.CONFIG.REDIS.host,
    port: global.CONFIG.REDIS.port,
    client: redisClient,
    ttl: 86400
})

// set up the redis store to saving session data
app.use(session({
    secret: global.CONFIG.SESSION.secret,
    store,
    name: 'BSID',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: global.CONFIG.SESSION.maxAge
    }
}))
app.use((req, res, next) => {
    if (!req.session) {
        console.error(`${moment().format('YYYY-MM-DD HH:mm:ss')} Something went wrong with Redis!`)
        return res.send(`${moment().format('YYYY-MM-DD HH:mm:ss')} Something went wrong with Redis!`)
    }
    next() // otherwise continue
})

// set extended urlencoded to true (post)
app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ extended: true }));

// set serving static files from the static dir
app.use(express.static(path.join(__dirname, 'static')));

/**
 * Routers
*/
const partials = require('./routers/partials');
app.use('/', partials.router);

const rootRouter = require('./routers/root');
app.use('/', rootRouter);

// run the server
app.listen(process.env.PORT, () => {
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} CORS-enabled web app listening on port ${process.env.PORT} Thermometer backend Node.js app`);
});
