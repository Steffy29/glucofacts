let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let morgan = require('morgan');
let app = express();
let dbaccess = require('./dbaccess');

// APP CONFIGURATION ----------------------------------
// use body parser to grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,rowlimits,rowsize');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

// ROUTES FOR API
// ====================================================

// basic route for the home page
app.get('/', function (req, res) {
    console.log('Welcome the home page');
    res.send('Welcome to the home page');
});

// get an instance of the express router
let apiRouter = express.Router();

// middleware to use for all requests
apiRouter.use(function (req, res, next) {
    // do logging
    console.log('Somebody just came to the API !');

    next();
});

// on routes that end in /glucofacts
apiRouter.route('/glucofacts')
    .get(function (req, res) {
        dbaccess.getGlucofacts(function (item) {
            console.log(item);
            res.status(200).send(item);
        });
    });

apiRouter.route('/glucofacts/glycemie/:year')
    .get(function (req, res) {
        let year = req.params.year;
        dbaccess.getGlycemiePerYear(year, function (item) {
            console.log(item);
            res.status(200).send(item);
        });
    });

apiRouter.route('/glucofacts/glycemy/:year')
    .get(function (req, res) {
        let year = req.params.year;
        dbaccess.getGlycemyPerYear(year, function (item) {
            console.log(item);
            res.status(200).send(item);
        });
    });

apiRouter.route('/glucofacts/glycemie/meth_ref/:meth_ref')
    .get(function (req, res) {
        let methRef = req.params.meth_ref;
        console.log(methRef);
        dbaccess.getGlycemieByMethRef(methRef, function (item) {
            console.log(item);
            res.status(200).send(item);
        });
    });

apiRouter.route('/glucofacts/glycemy/meth_ref/:meth_ref')
    .get(function (req, res) {
        let methRef = req.params.meth_ref;
        console.log(methRef);
        dbaccess.getGlycemyByMethRef(methRef, function (item) {
            console.log(item);
            res.status(200).send(item);
        });
    });

apiRouter.route('/glucofacts/bad_glycemie')
    .get(function (req, res) {
        let methRef = req.params.meth_ref;
        console.log(methRef);
        dbaccess.getDangerousGlycemie(function (item) {
            console.log(item);
            res.status(200).send(item);
        });
    });

apiRouter.route('/glucofacts/bad_glycemy')
    .get(function (req, res) {
        let methRef = req.params.meth_ref;
        console.log(methRef);
        dbaccess.getDangerousGlycemy(function (item) {
            console.log(item);
            res.status(200).send(item);
        });
    });

apiRouter.route('/glucofacts/measuring_moment')
    .get(function (req, res) {
        dbaccess.getMomentOfBloodSugarLevel(function (item) {
            console.log(item);
            res.status(200).send(item);
        });
    });

app.use('/api', apiRouter);

app.listen(process.env.PORT || 8282);
