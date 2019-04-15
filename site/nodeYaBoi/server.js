"use strict"

//============= Import Modules =============//
let http = require("http");
let fs = require("fs").promises;
let pug = require('pug');
//============= END Import Modules =============//

//============= Run Server =============//
let port = 8080;
let root = "./public";

let OK = 200, NotFound = 404, BadType = 415, Error = 500;
let types, paths;

start();
//============= END Run Server =============//



//Effectively main
async function start()
{
    //Try starting server with listener handle
    try
    {
        //Access the root folder ./public
        await fs.access(root);
        //Access index
        await fs.access(root + "/index.html");
        //Define the types globally
        types = defineTypes();
        //Create a set of paths and add / to it
        paths = new Set();
        paths.add("/");
        //Start the server with listener handle
        let server = http.createServer(handle);
        server.listen(port, "localhost");
        //Define the address
        let address = "http://localhost";
        address = address + ":" + port;

        //Print to console the address
        console.log("Server running at", address);
    }
    //Catch any errors that might be thrown
    catch (error)
    {
        //Print the error
        console.log(err);
        //Exit
        // process.exit(1);
    }
}

//Request listener
async function handle(request, response)//incomingMessage,serverResponse
{
    let errorCode;
    try 
    {
        // console.log("Method:", request.method);
        // console.log("URL:", request.url);
        // console.log("Headers:", request.headers);

        
        let requestedURL = request.url;
        if (requestedURL == "/" ) 
        {
            requestedURL = "/index.html";
        }

        errorCode = 404;
        let ok = await checkPath(requestedURL);
        if(!ok) {throw "Error 404: URL NotFound"};
    
        errorCode = 415;
        let type = findType(requestedURL);

        //Find the file to respond with
        let file = root + requestedURL;
        let content = await fs.readFile(file);

        //Deliver the file as a response
        deliver(response, type, content);

    } 
    catch (error)
    {
        //Print the error
        console.log("error caught!");
        console.log(error);
        //Exit
        return fail(response, errorCode, error.toString());


        // process.exit(1);
    }
}

// Check if a path is in or can be added to the set of site paths, in order
// to ensure case-sensitivity.
async function checkPath(path) 
{
    if (! paths.has(path)) 
    {
        let n = path.lastIndexOf("/", path.length - 2);
        let parent = path.substring(0, n + 1);
        let ok = await checkPath(parent);
        if (ok) await addContents(parent);
    }
    return paths.has(path);
}


// Add the files and subfolders in a folder to the set of site paths.
async function addContents(folder) 
{
    let folderBit = 1 << 14;
    let names = await fs.readdir(root + folder);
    for (let name of names) 
    {
        let path = folder + name;
        let stat = await fs.stat(root + path);
        if ((stat.mode & folderBit) != 0) path = path + "/";
        paths.add(path);
    }
}


// Find the content type to respond with, or undefined.
function findType(url) 
{
    let dot = url.lastIndexOf(".");
    let extension = url.substring(dot + 1);
    return types[extension];
}

// Deliver the file that has been read in to the browser.
function deliver(response, type, content)
{
    let typeHeader = { "Content-Type": type };
    console.log(typeHeader);
    response.writeHead(OK, typeHeader);
    response.write(content);
    response.end();
}

// Give a minimal failure response to the browser
function fail(response, code, text) 
{
    // let textTypeHeader = { "Content-Type": "text/plain" };
    // response.writeHead(code, textTypeHeader);
    // console.log
    // (
        // pug.renderFile( './views/error.pug', {name:'yeyeye'} )
    // );

    let file = pug.renderFile( './views/index.pug', {title:'yeyeye'} )
    response.write(file);
    // response.write()
    // response.render('error');
    // response.write(text, "utf8");
    response.end();
}




function defineTypes() 
{
    let types = 
    {
        html : "application/xhtml+xml",
        css  : "text/css",
        js   : "application/javascript",
        mjs  : "application/javascript", // for ES6 modules
        png  : "image/png",
        gif  : "image/gif",    // for images copied unchanged
        jpeg : "image/jpeg",   // for images copied unchanged
        jpg  : "image/jpeg",   // for images copied unchanged
        svg  : "image/svg+xml",
        json : "application/json",
        pdf  : "application/pdf",
        txt  : "text/plain",
        ttf  : "application/x-font-ttf",
        woff : "application/font-woff",
        aac  : "audio/aac",
        mp3  : "audio/mpeg",
        mp4  : "video/mp4",
        webm : "video/webm",
        ico  : "image/x-icon", // just for favicon.ico
        xhtml: undefined,      // non-standard, use .html
        htm  : undefined,      // non-standard, use .html
        rar  : undefined,      // non-standard, platform dependent, use .zip
        doc  : undefined,      // non-standard, platform dependent, use .pdf
        docx : undefined,      // non-standard, platform dependent, use .pdf
    }
    return types;
}