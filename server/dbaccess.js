let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'glucofacts'
});

function DbAccess() {
}

connection.connect();

DbAccess.getGlucofacts = function (writeCallback) {
    connection.query('SELECT * from Glycemie where glycemie is not null', function (error, results) {
        if (error) throw error;
        let string = JSON.stringify(results);
        console.log(string);
        writeCallback(string);
    });
};

DbAccess.getGlycemiePerYear = function (year, writeCallback) {
    let query = 'select concat(date_rel, \' \',time_rel) as date_glycemie, glycemie from Glycemie where date_rel between \'' + year + '-01-01\' and \'' + year + '-12-31\' and glycemie is not null order by date_rel, time_rel';
    connection.query(query, function (error, results) {
        if (error) throw error;
        let string = JSON.stringify(results);
        console.log(string);
        writeCallback(string);
    });
};

DbAccess.getGlycemyPerYear = function (year, writeCallback) {
    let response = [];
    let query = 'select concat(date_rel, \' \',time_rel) as date_glycemie, glycemie from Glycemie where date_rel between \'' + year + '-01-01\' and \'' + year + '-12-31\' and glycemie is not null order by date_rel, time_rel';
    let queryMax = 'select concat(date_rel, \' \',time_rel) as date_glycemie, max_recommended as glycemie from Glycemie where date_rel between \'' + year + '-01-01\' and \'' + year + '-12-31\' and glycemie is not null order by date_rel, time_rel';
    let queryMin = 'select concat(date_rel, \' \',time_rel) as date_glycemie, min_recommended as glycemie from Glycemie where date_rel between \'' + year + '-01-01\' and \'' + year + '-12-31\' and glycemie is not null order by date_rel, time_rel';
    connection.query(query, function (error, results) {
        if (error) throw error;
        let string = JSON.stringify(results);
        response.push({"query": string});
        connection.query(queryMax, function (error, res) {
            if (error) throw error;
            string = JSON.stringify(res);
            response.push({"max": string});
            connection.query(queryMin, function (error, res) {
                if (error) throw error;
                string = JSON.stringify(res);
                response.push({"min": string});
                writeCallback(response);
            })
        });
    });
};

DbAccess.getGlycemieByMethRef = function(methRef, writeCallback) {
    let query = 'select concat(date_rel, \' \',time_rel) as date_glycemie, glycemie from Glycemie where meth_ref=\''+ methRef +'\' and glycemie is not null order by date_rel, time_rel';
    connection.query(query, function (error, results) {
        if (error) throw error;
        let string = JSON.stringify(results);
        console.log(string);
        writeCallback(string);
    });
};

DbAccess.getGlycemyByMethRef = function(methRef, writeCallback) {
    let response = [];
    let query = 'select concat(date_rel, \' \',time_rel) as date_glycemie, glycemie from Glycemie where meth_ref=\''+ methRef +'\' and glycemie is not null order by date_rel, time_rel';
    let queryMax = 'select concat(date_rel, \' \',time_rel) as date_glycemie, max_recommended as glycemie from Glycemie where meth_ref=\''+ methRef +'\' and glycemie is not null order by date_rel, time_rel';
    let queryMin = 'select concat(date_rel, \' \',time_rel) as date_glycemie, min_recommended as glycemie from Glycemie where meth_ref=\''+ methRef +'\' and glycemie is not null order by date_rel, time_rel';
    connection.query(query, function (error, results) {
        if (error) throw error;
        let string = JSON.stringify(results);
        response.push({"query": string});
        connection.query(queryMax, function (error, res) {
            if (error) throw error;
            string = JSON.stringify(res);
            response.push({"max": string});
            connection.query(queryMin, function (error, res) {
                if (error) throw error;
                string = JSON.stringify(res);
                response.push({"min": string});
                writeCallback(response);
            })
        });
    });
};

DbAccess.getDangerousGlycemie = function( writeCallback) {
    let query = 'select concat(date_rel, \' \',time_rel) as date_glycemie, glycemie from Glycemie where before_lunch = 1 and (glycemie < 70 or glycemie > 120) order by date_rel, time_rel';
    connection.query(query, function (error, results) {
        if (error) throw error;
        let string = JSON.stringify(results);
        console.log(string);
        writeCallback(string);
    });
};

DbAccess.getDangerousGlycemy = function( writeCallback) {
    let response = [];
    let query = 'select concat(date_rel, \' \',time_rel) as date_glycemie, glycemie from Glycemie where before_lunch = 1 and (glycemie < 70 or glycemie > 120) order by date_rel, time_rel';
    let queryMax = 'select concat(date_rel, \' \',time_rel) as date_glycemie, max_recommended as glycemie from Glycemie where before_lunch = 1 and (glycemie < 70 or glycemie > 120) order by date_rel, time_rel';
    let queryMin = 'select concat(date_rel, \' \',time_rel) as date_glycemie, min_recommended as glycemie from Glycemie where before_lunch = 1 and (glycemie < 70 or glycemie > 120) order by date_rel, time_rel';
    connection.query(query, function (error, results) {
        if (error) throw error;
        let string = JSON.stringify(results);
        response.push({"query": string});
        connection.query(queryMax, function (error, res) {
            if (error) throw error;
            string = JSON.stringify(res);
            response.push({"max": string});
            connection.query(queryMin, function (error, res) {
                if (error) throw error;
                string = JSON.stringify(res);
                response.push({"min": string});
                writeCallback(response);
            })
        });
    });
};

module.exports = DbAccess;
