module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.message || (req.body && req.body.message)) {

        var message = (req.query.message || req.body.message);

        var connectString = 'DefaultEndpointsProtocol=https;AccountName=function41bedd119c61;AccountKey=PuHsT4RStNtm4FPSVnyA+5Rl9mtRYDnu4tdacUXqcLfCy6cqmNtlQDvXd1s4Sn9ZtbwpOV4bnEiKta2NHsiBJg==;';
        var azure = require('azure-storage');
        var queueName = 'aaronqueue1';
        var queueService = azure.createQueueService(connectString);

        queueService.createQueueIfNotExists(queueName, function (error) {
            if (!error) {
                // Queue exists
            }
        });


        queueService.createMessage(queueName, message, function (error) {
            if (!error) {
                console.log('Message inserted');
            }
        });

        queueService.getMessages(queueName, function (error, serverMessages) {
            if (!error) {
                // Process the message in less than 30 seconds, the message
                // text is available in serverMessages[0].messageText
                console.log("1", serverMessages);
            }
        });


        context.res = {
            status: 200,
            body: "Success: " + (req.query.message || req.body.message)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done();
};