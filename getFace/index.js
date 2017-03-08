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
var connection = new Connection(config);
var dataset = [];
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    connection.on('connect', function (err) {
        console.log("Connected");
        request = new Request("SELECT * FROM face_info", function (err) {
            if (err) {
                console.log(err);
            }
        });
        var result = "";
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                dataset.push({
                    col: column.metadata.colName,
                    val: column.value
                });
            });
        });
        request.on('doneProc', function (rowCount, more, returnStatus, rows) {
            context.res = {
                status: 200,
                body: JSON.stringify(dataset)
            };
            context.done();
        });
        connection.execSql(request);
    });

};