"use strict";
//This is the entry point
const express = require('express');
const app = express();

app.get('/', (request, response) => 
    {
        response.send('Hello World!')
    });
  
app.listen(8080, () => 
    {
        console.log('Example app listening on port 8080!')
    });