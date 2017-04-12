module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var Connection = require('tedious').Connection;
    var Request = require('tedious').Request;
    var TYPES = require('tedious').TYPES;

    var config = {
        userName: 'aaron',
        password: 'Apple9705',
        server: 'azure-server-demo.database.windows.net',
        // If you are on Microsoft Azure, you need this:  
        options: { encrypt: true, database: 'azure-db-demo' }
    };
    var connection = new Connection(config);

    var faceId = (req.query.faceId || req.body.faceId);
    var gender = (req.query.gender || req.body.gender);
    var age = (req.query.age || req.body.age);

    connection.on('connect', function (err) {
        console.log("Connected");

        request = new Request("INSERT INTO face_info (faceId, gender, age) VALUES (@faceId, @gender, @age)", function (err, rowCount) {
            if (err) {
                console.error(err);
            }
        });

        request.addParameter('faceId', TYPES.NVarChar, faceId);
        request.addParameter('gender', TYPES.NVarChar, gender);
        request.addParameter('age', TYPES.NVarChar, age);
        /*
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    console.log("Product id of inserted item is " + column.value);
                }
            });
        });
        */
        connection.execSql(request);

        context.res = {
            status: 200,
            body: 'Success'
        };

        context.done();
    });



    /*
        request = new Request("INSERT INTO face_info (faceId, gender, age) VALUES (" + faceId + ", " + gender + ", " + age + ")", function (err) {
            if (err) {
                console.log(err);
                context.res = {
                    status: 400,
                    body: err
                };
            } else {
                context.res = {
                    status: 200,
                    body: 'Success'
                };
            }
        });
        */
};
