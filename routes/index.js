var fs = require('fs'),
    seo = JSON.parse(fs.readFileSync(__dirname + '/seo.json'));

var dotenv = require('dotenv');
var pg = require('pg');

//client id and client secret here, taken from .env (which you need to create)
dotenv.load();

//connect to database
var conString = process.env.DATABASE_CONNECTION_URL;

exports.router = {
    index: function(req, res) {
        res.render('leaflet', { seo : seo });
    },
    projects: function(req, res) {
        res.render('projects', { seo : seo });
    },
    services: function(req, res) {
        res.render('services', { seo : seo });
    },
    downloads: function(req, res) {
        res.render('downloads', { seo : seo });
    },
    about: function(req, res) {
        res.render('about', { seo : seo });
    },
    contact: function(req, res) {
        res.render('contact', { seo : seo });
    },
    schoolData: function(req, res) {
        var schoolQuery = "SELECT * " +
                " FROM cogs121_16_raw.sandag_places_project" +
                " WHERE \"TYPE\" = 'School'" + 
                " AND \"LATITUDE\" <  32.95  AND \"LATITUDE\" >  32.62" +
                " AND \"LONGITUDE\" > -117.258 AND \"LONGITUDE\" < -116.977" + 
                " AND \"NAME\" LIKE '%Elementary%'" + 
                " ORDER BY \"NAME\" ASC;";
        makeQuery(req, res, schoolQuery, './schoolData.json');
    },
    parkData: function(req, res) {
        var parkQuery = "SELECT * " +
            " FROM cogs121_16_raw.sandag_places_project" +
            " WHERE \"TYPE\" = 'Park'" + 
            " AND \"LATITUDE\" <  32.95  AND \"LATITUDE\" >  32.62" +
            " AND \"LONGITUDE\" > -117.258 AND \"LONGITUDE\" < -116.977" + 
            " AND \"NAME\" LIKE '%Park%'" + 
            " ORDER BY \"NAME\" ASC;";
        makeQuery(req, res, parkQuery, './parkData.json');
    },
    recData: function(req, res) {
        var recQuery = "SELECT * " +
            " FROM cogs121_16_raw.sandag_places_project" +
            " WHERE \"TYPE\" = 'Park'" + 
            " AND \"LATITUDE\" <  32.95  AND \"LATITUDE\" >  32.62" +
            " AND \"LONGITUDE\" > -117.258 AND \"LONGITUDE\" < -116.977" + 
            " AND \"NAME\" LIKE '%Recreation%'" + 
            " ORDER BY \"NAME\" ASC;";
        makeQuery(req, res, recQuery, './recData.json');
    }

};

function makeQuery(req, res, queryString, file) {
    var result = [];

    // Grab data from http request
     // var data = {text: req.body.text, complete: false};

    // Get a Postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        // client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

        /* Get all SCHOOLS in San Diego area specified by certain latitudes and longitudes */
        /*   
        var query = client.query("SELECT * " +
            " FROM cogs121_16_raw.sandag_places_project" +
            " WHERE \"TYPE\" = 'School'" + 
            " AND \"LATITUDE\" <  32.95  AND \"LATITUDE\" >  32.62" +
            " AND \"LONGITUDE\" > -117.258 AND \"LONGITUDE\" < -116.977" + 
            " AND \"NAME\" LIKE '%Elementary%'" + 
            " ORDER BY \"NAME\" ASC;");
        */
        var query = client.query(queryString);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            // jsonToFile(file, result);
            return res.json(result);
        });
    });
    return { delphidata: "No data present." }
}

function jsonToFile(file, jsonObject) {
    var jsonfile = require('jsonfile');
    jsonfile.writeFile(file, jsonObject, {spaces: 2}, function(err) {
        console.error(err)
    });
}
