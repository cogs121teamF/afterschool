var express  = require('express'),
    compress = require('compression'),
    hbs      = require('hbs'),
    moment   = require('moment'),
    router   = require(__dirname + '/routes').router,
    app      = express(),
    error    = require(__dirname + '/middleware/error');

var dotenv = require('dotenv');
var pg = require('pg');

//client id and client secret here, taken from .env (which you need to create)
dotenv.load();

//connect to database
var conString = process.env.DATABASE_CONNECTION_URL;

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('dateFormat', function(context, block) {
    var f = block.hash.format || "MMM DD, YYYY hh:mm:ss A";
    return moment(context).format(f);
});

app.set('view engine', 'html');
app.set('views', __dirname + '/views/pages');
app.set('port', process.env.PORT || 3000);
app.engine('html', hbs.__express);

app.use(compress({
    filter: function(req, res) {
        return (/json|text|javascript|css|image\/svg\+xml|application\/x-font-ttf/).test(res.getHeader('Content-Type'));
    },
    level: 9
}));

/*
if (app.get('env') === 'development'){
    app.use(express.static(__dirname + '/public', {maxAge: 86400000}));
}
*/

app.use(express.static('public'));

var route = express.Router();

route.get('/index.html', function(req, res){
    res.redirect(301, '/');
});
route.get('/', router.index);
route.get('/projects.html', router.projects);
route.get('/services.html', router.services);
route.get('/downloads.html', router.downloads);
route.get('/about.html', router.about);
route.get('/contact.html', router.contact);
route.get('/schoolData', router.schoolData);
route.get('/parkData', router.parkData);
route.get('/recData', router.recData);
route.get('/libData', router.libData);

app.use('/', route);

app.use(error.notFound);
app.use(error.serverError);

module.exports = app;
