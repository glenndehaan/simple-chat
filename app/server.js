/**
 * Import base packages
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const browsersupport = require('express-browsersupport');
const mongoose = require('mongoose');

/**
 * Import own packages
 */
const config = require('./config');
const webRouter = require('./routers/Web');
const apiRouter = require('./routers/Api');
const indexController = require('./controllers/Web/IndexController');
const Socket = require("./helpers/modules/Socket");

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Init logger and set log level
 */
global.log = require('simple-node-logger').createSimpleLogger({
    logFilePath: `${dev ? __dirname : process.cwd()}${config.logger.location}`,
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});
global.log.setLevel(config.logger.level);

/**
 * Set template engine
 */
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

/**
 * Trust proxy
 */
app.enable('trust proxy');

/**
 * Setup socket
 */
new Socket(app);

/**
 * Serve static public dir
 */
app.use(express.static(`${__dirname}/../public`));

/**
 * Configure app to use bodyParser()
 */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
 * Configure app to use Browser Support
 */
app.use(browsersupport({
    redirectUrl: "/oldbrowser",
    supportedBrowsers: config.application.supportedBrowsers
}));

/**
 * Configure routers
 */
app.use('/', webRouter.router);
app.use('/api', apiRouter.router);

/**
 * Render sitemap.xml and robots.txt
 */
app.get('/sitemap.xml', (req, res) => {
    indexController.siteMapAction(req, res, webRouter.routes);
});
app.get('/robots.txt', (req, res) => {
    indexController.robotsAction(req, res);
});

/**
 * Render old browser page
 */
app.get('/oldbrowser', (req, res) => {
    indexController.oldBrowserAction(req, res);
});

/**
 * Setup default 404 message
 */
app.use((req, res) => {
    res.status(404);

    // respond with json
    if (req.originalUrl.split('/')[1] === 'api') {

        /**
         * API 404 not found
         */
        res.send({error: 'This API route is not implemented yet'});
        return;
    }

    indexController.notFoundAction(req, res);
});

/**
 * Disable powered by header for security reasons
 */
app.disable('x-powered-by');

/**
 * Start listening on port
 */
const server = app.listen(config.application.port, config.application.bind, () => {
    global.log.info(`[NODE] App is running on: ${config.application.bind}:${config.application.port}`);
});

/**
 * Configure mongo
 */
if (typeof config.mongo !== "undefined") {
    if (config.mongo.auth) {
        mongoose.connect(`mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/${config.mongo.database}?authSource=admin`, (err) => {
            if (err) {
                global.log.error(`[MONGO] Error while connecting: ${err}`)
            } else {
                global.log.info(`[MONGO] Mongo connection successful!`);
            }
        });
    } else {
        mongoose.connect(`mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`, (err) => {
            if (err) {
                global.log.error(`[MONGO] Error while connecting: ${err}`)
            } else {
                global.log.info(`[MONGO] Mongo connection successful!`);
            }
        });
    }
}

/**
 * Handle nodemon shutdown
 */
process.once('SIGUSR2', () => {
    server.close(() => {
        console.log(`[NODE] Express exited! Port ${config.application.port} is now free!`);
        process.kill(process.pid, 'SIGUSR2');
    });
});
