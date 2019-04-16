"use strict"

//============= Import Modules =============//
// let http = require("http");
let fs = require("fs").promises;
// let fs = require("q-io/fs");
let http = require("q-io/http");
// let pug = require('pug');
let ejs = require('ejs');
let qs = require("querystring");
let sql = require("sqlite");

//============= END Import Modules =============//

//============= Run Server =============//
let port = 8080;
let root = "./public";

let OK = 200, NotFound = 404, BadType = 415, Error = 500;
let types, paths;
let address = "http://localhost:" + port;

let locationPages;

let db;

start();
//============= END Run Server =============//



//Effectively main
async function start()
{
    //Try starting server with listener handle
    try
    {
        db = await sql.open('./database/db.sqlite');
        //Access the root folder ./public
        await fs.access(root);
        //Access index
        await fs.access(root + "/index.html");
        //Define the types globally
        types = defineTypes();
        locationPages = defineLocationPages();
        //Create a set of paths and add / to it
        paths = new Set();
        paths.add("/");
        //Start the server with listener handle
        // let server = http.createServer(handle);
        let server = http.Server(handle);
        await server.listen(port, "localhost");
        //Define the address
        // let address = "http://localhost";
        // address = address + ":" + port;

        //Print to console the address
        console.log("Server running at", address);
    }
    //Catch any errors that might be thrown
    catch (error)
    {
        //Print the error
        console.log(error);
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

        
        let requestedURL = request.node.url;
        //remove http://localhost:+port from URL
        // requestedURL = requestedURL.substring(address.length);
        // console.log("req url"+requestedURL);

        //if requested URL is / then direct to homepage
        if(requestedURL == "/" )
        {
            requestedURL = "/index.html";
        }
        
        //If URL contains ?submit-comment then submit a comment
        if(await checkIfComment(requestedURL))
        {
            //handle comment
            // console.log("made comment");

            //parse the page we want
            // ?submit-comment has 15 characters
            let pageToCommentOn = requestedURL.substring(1,requestedURL.length-20);
            // console.log(pageToCommentOn);

            // console.log(request);
            // console.log(request.body);
            let body = await request.body.read();
            let bodyString = body.toString();
            // console.log("Body:", body.toString());
            // name=BOIIII&text=boi

            let params = qs.parse(bodyString);
            let name = params.name;
            let text = params.text;
            let date = new Date().toUTCString();

            //add comment to database
            await db.run("insert into comments (name,text,date,page) values ('" + name + "','" + text + "','" + date + "','" + pageToCommentOn + "')");
            
            //reload page
            let comments = await db.all("select * from comments where page = '" + pageToCommentOn + "'")
            let htmlContent = await fs.readFile('./views/'+pageToCommentOn+'.ejs', 'utf8');
            let renderedHTML = ejs.render(htmlContent, {comments:comments}, function(err, data) 
            {
                console.log(err || data)
            }); 

            response.node.write(renderedHTML);
            response.node.end(); 
            
        }
        //Otherwise, deliver a file
        else
        {
            // errorCode = 404;
            let ok = await checkPath(requestedURL);
            if(!ok) {throw "Error 404: URL NotFound"};

            errorCode = 415;
            let type = findType(requestedURL);

            // console.log(requestedURL);

            //Find the file to respond with
            let file = root + requestedURL;
            // console.log("file: "+file)
            
            let content = await fs.readFile(file);

            //If dynamic location pages
            
            //'/tokyo.html'
            if(locationPages.includes(requestedURL.substring(1)))
            {
                let pageName = requestedURL.substring(1,requestedURL.length-4);
                // await render()
                let comments = await db.all("select * from comments where page = '"+pageName+"'")
                let htmlContent = await fs.readFile('./views/'+pageName+'.ejs', 'utf8');
                let renderedHTML = ejs.render(htmlContent, {comments:comments}, function(err, data) 
                {
                    console.log(err || data)
                }); 

                response.node.write(renderedHTML);
                response.node.end(); 
            }
            //Else, deliver a static file
            else
            {
                //Deliver the file as a response
                await deliver(response, type, content);
            }
        }

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

//checks if user is submitting a comment
// ?submit-comment
async function checkIfComment(url)
{
    let n = url.lastIndexOf("?");
    if(url.substring(n+1) == "submit-comment")
    {
        // console.log(url.substring(n));
        return true;
    }
    else
    {
        // console.log(url.substring(n));
        return false;
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
async function deliver(response, type, content)
{
    let typeHeader = { "Content-Type": type };

    response.node.writeHead(OK, typeHeader);
    response.node.write(content);
    response.node.end();
}

// Give a minimal failure response to the browser
async function fail(response, code, text) 
{
    // let file = pug.renderFile( './views/index.pug', {title:'yeyeye'} )
    let htmlContent = await fs.readFile('./views/error.ejs', 'utf8');
    let renderedHTML = ejs.render(htmlContent, {error: text}, function(err, data) 
    {
        console.log(err || data)
    });
    
    response.node.write(renderedHTML);
    response.node.end();
}



function defineLocationPages()
{
    let locationPages = 
    [
        "tokyo.html"
    ];
    return locationPages;
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