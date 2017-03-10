var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var config = {
    userName: 'aaron',
    password: 'q999999Q',
    server: 'aaron-db-server.database.windows.net',
    // If you are on Microsoft Azure, you need this:  
    options: { encrypt: true, database: 'aaron-db-1' }
};
var connection;
var dataset = [];
var tmpContext;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    connection = new Connection(config);
    dataset = [];
    connection.on('connect', function (err) {
        console.log("Connected");
        tmpContext = context;
        executeStatement();
    });

};

function executeStatement() {
    request = new Request("SELECT * FROM face_info", function (err) {
        connection.close();
        if (err) {
            console.log(err);
            tmpContext.res = {
                status: 400,
                body: 'Error: ' + err
            };
        } else {
            tmpContext.res = {
                status: 200,
                body: JSON.stringify(dataset)
            };
        }
        tmpContext.done();
    });
    var result = "";
    request.on('row', function (columns) {
        var row = {};
        columns.forEach(function (column) {
            row[column.metadata.colName] = column.value;
        });
        dataset.push(row);
    });
    connection.execSql(request);
}