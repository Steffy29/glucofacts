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

DbAccess.getGlycemieByMethRef = function (methRef, writeCallback) {
    let query = 'select concat(date_rel, \' \',time_rel) as date_glycemie, glycemie from Glycemie where meth_ref=\'' + methRef + '\' and glycemie is not null order by date_rel, time_rel';
    connection.query(query, function (error, results) {
        if (error) throw error;
        let string = JSON.stringify(results);
        console.log(string);
        writeCallback(string);
    });
};

DbAccess.getGlycemyByMethRef = function (methRef, writeCallback) {
    let response = [];
    let query = 'select concat(date_rel, \' \',time_rel) as date_glycemie, glycemie from Glycemie where meth_ref=\'' + methRef + '\' and glycemie is not null order by date_rel, time_rel';
    let queryMax = 'select concat(date_rel, \' \',time_rel) as date_glycemie, max_recommended as glycemie from Glycemie where meth_ref=\'' + methRef + '\' and glycemie is not null order by date_rel, time_rel';
    let queryMin = 'select concat(date_rel, \' \',time_rel) as date_glycemie, min_recommended as glycemie from Glycemie where meth_ref=\'' + methRef + '\' and glycemie is not null order by date_rel, time_rel';
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

DbAccess.getDangerousGlycemie = function (writeCallback) {
    let query = 'select concat(date_rel, \' \',time_rel) as date_glycemie, glycemie from Glycemie where before_lunch = 1 and (glycemie < 70 or glycemie > 120) order by date_rel, time_rel';
    connection.query(query, function (error, results) {
        if (error) throw error;
        let string = JSON.stringify(results);
        console.log(string);
        writeCallback(string);
    });
};

DbAccess.getDangerousGlycemy = function (writeCallback) {
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

DbAccess.getMomentOfBloodSugarLevel = function (writeCallback) {
    let response = [];
    let queryBeforeLunch = 'select distinct before_lunch, count(before_lunch) as nbBeforeLunch from Glycemie group by before_lunch';
    let queryAfterLunch = 'select distinct after_lunch, count(after_lunch) as nbAfterLunch from Glycemie group by after_lunch';
    let queryNbResults = 'select count(*) as nbResults from Glycemie';
    connection.query(queryNbResults, function (err, res) {
        if (err) throw err;
        let string = JSON.parse(JSON.stringify(res));
        let nbResults = string[0].nbResults;
        let nbNonCategorized = 0;
        let nbBeforeLunch = 0;
        let nbAfterLunch = 0;
        console.log(nbResults);
        connection.query(queryBeforeLunch, function (err, res) {
            if (err) throw err;
            string = JSON.parse(JSON.stringify(res));
            string.forEach(function(before) {
               if (before.before_lunch === '1') {
                   nbBeforeLunch = before.nbBeforeLunch;
               }
            });
            connection.query(queryAfterLunch, function (err, res) {
                if (err) throw err;
                string = JSON.parse(JSON.stringify(res));
                string.forEach(function(after) {
                    if (after.after_lunch === '1') {
                        nbAfterLunch = after.nbAfterLunch;
                    }
                });

                nbNonCategorized = nbResults - (nbBeforeLunch + nbAfterLunch);

                console.log(string, nbNonCategorized, nbBeforeLunch, nbAfterLunch);

                let calcul = 0;
                calcul = (nbBeforeLunch * 100) / nbResults;
                response.push({type: "Results Before Lunch", ratio: calcul, color: "#42f450"});
                calcul = (nbAfterLunch * 100) / nbResults;
                response.push({type: "Results After Lunch", ratio: calcul, color: "#e2c72b"});
                calcul = (nbNonCategorized * 100) / nbResults;
                response.push({type: "Results Non Categorized", ratio: calcul, color: "#19cae5"});
                writeCallback(response);
            });
        });
    });
};

module.exports = DbAccess;
