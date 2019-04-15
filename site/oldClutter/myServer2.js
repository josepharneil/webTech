//First, we get express module
const express = require('express')
//Run express to create app variable
const app = express();
//We may create multiple apps this way,
//each with their own requests and responses

//We now tell our Express server how to handle a GET request to our server.
//Express includes similar functions for POST, PUT, etc.
//These kinds of functions take two main parameters
//1) The URL for this function act upon.
//2) A function with two parameters:req and res.
//  req represents the request that was sent to the server
//  res represents the response that will be sent back to the client.

//So in this case:
//1) We target the root folder of our website
//2) Req is empty. Response is 'An alligator approaches!'.
app.get('/', (req, res) =>  
{
    res.send('An alligator approaches!');
});


//Finally, after we've set up our requests, we must start our server.
//We pass 8080 into the listen function, will tells the app which port to listen on.
//The function passed in as a second parameter, and is optional.
//It runs when the server starts up.
//In this case its an anonymous function that writes to the console.
app.listen(8080, () => console.log('Gator app listening on port 8080!'));

