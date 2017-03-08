module.exports = function(context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.message || (req.body && req.body.message)) {

        var message = (req.query.message || req.body.message);
        var azure = require('azure');
        var queueBusString = 'Endpoint=sb://aaron-service-bus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=2iIUjTo+wsIn37UivrNxLqGl3ie+Ossnbc0Rc4mNvZE=';
        var serviceBusService = azure.createServiceBusService(queueBusString);
        var queueName = 'aaronqueue';
        serviceBusService.createQueueIfNotExists(queueName, function(error) {
            if (!error) {
                // Queue exists
            }
        });

        var queueMessage = {
            body: message,
            customProperties: {
                testproperty: 'TestValue'
            }
        };
        serviceBusService.sendQueueMessage(queueName, queueMessage, function(error) {
            if (!error) {
                console.log('Service bus service success');
            }
        });

        context.res = {
            // status: 200, /* Defaults to 200 */
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