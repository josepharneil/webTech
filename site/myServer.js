let http = require('http');
let server = http.createServer(function (request, response) 
    {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("Hello World\n");
    });
server.listen(8080);

// const fs = require('fs');
// fs.readFile('package.json', function (err, buf){
//     console.log(buf.toString());
// });


// get the reference of EventEmitter class of events module
const events = require('events');
//create an object of EventEmitter class by using above reference
const em = new events.EventEmitter();
// register a listener for the 'knock' event
em.on('knock', function (data) {
    console.log('Received the knock event: ' + data);
});
// trigger an event called 'knock'
em.emit('knock', "who's there?");