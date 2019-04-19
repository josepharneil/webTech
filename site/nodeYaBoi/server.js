"use strict"

//============= Import Modules =============//
// let http = require('http');
let https = require('https');
// let http = require("q-io/http");
let fs = require("fs").promises;
// let fs = require("q-io/fs");

// let pug = require('pug');
let ejs = require('ejs');
let qs = require("querystring");
let sql = require("sqlite");
let crypto = require('crypto');
let shajs = require('sha.js');

//============= END Import Modules =============//

//============= Run Server =============//
let port = 8443;
let root = "./public";

let OK = 200, NotFound = 404, BadType = 415, Error = 500;
let types, paths;
let address = "https://localhost:" + port;
let locationPages;
let db;
var cookieMap = new Map();

start();
//============= END Run Server =============//



//Effectively main
async function start()
{
    //Try starting server with listener handle
    try
    {

        let privateKey = await fs.readFile('./crypto/privatekey.pem');
        let certificate = await fs.readFile('./crypto/certificate.pem');
        const options = {key: privateKey, cert: certificate};

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
        
        let server = https.createServer(options, handle);
        // let server = http.Server(handle);
        // server.setSecure(credentials);
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

async function validate(URL)
{
    var result = true;
    console.log(URL);
    console.log(URL.match(/\/\./g));
    // reject occurences of /.
    if(await URL.match(/\/\./g) !== null)
    {
        console.log("rejection 1");
        result = false;
    }
    //reject occurences of //
    if(await URL.match(/\/\//g) !== null)
    {
        console.log("rejection 2");
        result = false;
    }
    //reject URLs not starting with /
    if(!URL.startsWith("/"))
    {
        console.log("rejection 3");
        result = false;
    }
    //reject URL if ends in /
    if(URL[URL.length -1] == "/")
    {
        console.log("rejection 4");
        result = false;
    }
    //reject if any non ascii characters, or non meaningful ascii characters
    var ascii = /^[ -~]+$/;
    if(!ascii.test(URL))
    {
        console.log("rejection 5");
        result = false; 
    }
    return result;
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

        if(requestedURL == "/" )
        {
            requestedURL = "/index.html";
        }

        let isValid = await validate(requestedURL);
        //let isValid = true;
        if(!isValid)
        {
            console.log("URL REJECTED!");
            return;
        }

        if(requestedURL == '/favicon.ico')
        {
            return;
        }

        let cookie = request.headers.cookie;
        var currentSessionID;
        var sessionEmail;
        var sessionUsername;
        if(typeof cookie !== 'undefined')
        {
            let parts = cookie.split("=");
            currentSessionID = parts[1];

            sessionEmail = cookieMap.get(currentSessionID);
            if (typeof sessionEmail !== 'undefined')
            {
                var ps = await db.prepare("select * from users where email = ?");
                // sessionUsername = (await db.all("select * from users where email = '" + sessionEmail + "'"))[0].name;

                sessionUsername = (await ps.all(sessionEmail))[0].name;
                await ps.finalize();
            }
        }
        
        // console.log(cookie);

        //if requested URL is / then direct to homepage

        //============= Write type =============//
        let type = findType(requestedURL);
        //============= END Write type =============//


        //============= SUBMIT COMMENT =============//
        //If URL contains ?submit-comment then submit a comment
        if(await checkIfComment(requestedURL))
        {
            //handle comment

            //parse the page we want
            // ?submit-comment has 15 characters, .html has 5
            let pageToCommentOn = requestedURL.substring(1,requestedURL.length-20);

            //Callback-style read body
            var body = '';
            request.on('data', async function (data) 
            {
                body += data;
            });
            request.on('end', async function () 
            {
    
                let params = await qs.parse(body);
                let name = sessionUsername;
                let text = params.text;
                let date = new Date().toUTCString();

                //add comment to database
                var ps = await db.prepare("insert into comments (name,text,date,page) values (?,?,?,?)");
                await ps.run(name,text,date,pageToCommentOn);
                await ps.finalize();

                //reload page
                var ps = await db.prepare("select * from comments where page = ?");
                let comments = await ps.all(pageToCommentOn);
                await ps.finalize()
                let htmlContent = await fs.readFile('./views/'+pageToCommentOn+'.ejs', 'utf8');

                var renderedHTML;
                if(cookieMap.has(currentSessionID))
                {
                    renderedHTML = await ejs.render(htmlContent, { signuplogin: "Signed in as: " +sessionUsername,username: "Posting as: " + sessionUsername,comments:comments,isdisabled:"" }, function(err, data) 
                    {
                        console.log(err || data)
                    });
                }
                else
                {
                    renderedHTML = await ejs.render(htmlContent, {signuplogin: "Signup/Login",comments:comments,username:"You must be logged in to comment",isdisabled:"disabled"}, function(err, data) 
                    {
                        console.log(err || data)
                    });
                }


                //Redirect to the footer (the bottom of the page)
                response.writeHead(302,  {Location: "/"+pageToCommentOn+".html#footer-container", "Content-Type": types['html'] });
                response.write(renderedHTML);
                response.end();
            });

            

            
            
        }
        //============= END SUBMIT COMMENT =============//

        //============= SUBMIT SIGNUP =============//
        //If URL contains ?submit-signup, then submit a signup
        else if(await checkIfSignUp(requestedURL))
        {
            //Callback-style read body
            var body = '';
            //start reading body
            request.on('data', async function (data) 
            {
                body += data;
            });
            //when finished reading body
            request.on('end', async function () 
            {
                let params = await qs.parse(body);
                let name = params.name;
                let email = params.email;
                let password = params.password;

                ///salted hash///
                let buf = crypto.randomBytes(32);
                let salt = toHexString(buf);

                let saltedPassword = password + salt;
                let hashedSaltedPassword = shajs('sha256').update(saltedPassword).digest('hex');
                ////end salted hash///

                //Check for email uniqueness in database
                var ps = await db.prepare("select * from users where email = ?");
                let checkUnique = await ps.all(email);
                await ps.finalize();

                //if not unique, reload page with ejs view of "! not unique email !"
                if(checkUnique.length != 0)
                {
                    //non valid email
                    let htmlContent = await fs.readFile('./views/signup-login.ejs', 'utf8');
                    let renderedHTML = await ejs.render(htmlContent, {signuperrormessage:"There is already an account associated with this email.",loginerrormessage:""}, function(err, data) 
                    {
                        console.log(err || data);
                    });

                    //redirect to login container
                    response.writeHead(OK, {"Content-Type": types['html']})
                    response.write(renderedHTML);
                    response.end();
                }
                else
                {
                    //if unique, continue signup
                    var ps = await db.prepare("insert into users (name,email,password,salt) values (?,?,?,?)");
                    await ps.run(name,email,hashedSaltedPassword,salt);

                    await ps.finalize();
                    // console.log(await db.all("select * from users"));

                    let htmlContent = await fs.readFile('./views/signup-login.ejs', 'utf8');
                    let renderedHTML = await ejs.render(htmlContent, {signuperrormessage:"Account created successfully; please log in.",loginerrormessage:""}, function(err, data) 
                    {
                        console.log(err || data);
                    });

                    //redirect to login container
                    response.writeHead(OK, {"Content-Type": types['html']})
                    response.write(renderedHTML);
                    response.end();
                }
            });

            
            
        }
        //============= END SUBMIT SIGNUP =============//

        //============= SUBMIT LOGIN =============//
        //If URL contains ?submit-login, then submit a signup
        else if(await checkIfLogIn(requestedURL))
        {

            //Callback-style read body
            var body = '';
            request.on('data', async function (data) 
            {
                body += data;
            });
            request.on('end', async function () 
            {
                let params = await qs.parse(body);
                let email = params.email;
                
                // let checkEmail = await db.all("select * from users where email = '" + email + "'");
                var ps = await db.prepare("select * from users where email = ?");
                let checkEmail = await ps.all(email);
                await ps.finalize();

                if(checkEmail.length == 0)
                {
                    //redirect invalid email or password
                    console.log("invalid email or pword");

                    let htmlContent = await fs.readFile('./views/signup-login.ejs', 'utf8');
                    // console.log(htmlContent);
                    let renderedHTML = await ejs.render(htmlContent, {signuperrormessage: "",loginerrormessage:"An account does not exist with the submitted email and password."}, function(err, data) 
                    {
                        console.log(err || data);
                    });

                    //redirect to login container
                    response.writeHead(OK, {"Content-Type": types['html']})
                    response.write(renderedHTML);
                    response.end()
                }
                else
                {
                    var ps = await db.prepare("select * from users where email = ?");
                    // let salt = (await db.all("select * from users where email = '" + email + "'"))[0].salt;
                    let salt = (await ps.all(email))[0].salt;
                    await ps.finalize();
                    let password = params.password;
                    let saltedPassword = password + salt;

                    let hashedSaltedPassword = await shajs('sha256').update(saltedPassword).digest('hex');
                    
                    var ps = await db.prepare("select * from users where email = ? and password = ?");
                    // let checkUser = await db.all("select * from users where email = '" + email + "' and password = '" + hashedSaltedPassword + "'");
                    let checkUser = await ps.all(email, hashedSaltedPassword);
                    await ps.finalize();
                    if(checkUser.length == 0)
                    {
                        //redirect invalid email or password
                        console.log("invalid email or pword");

                        let htmlContent = await fs.readFile('./views/signup-login.ejs', 'utf8');
                        // console.log(htmlContent);
                        let renderedHTML = await ejs.render(htmlContent, {signuperrormessage: "",loginerrormessage:"An account does not exist with the submitted email and password."}, function(err, data) 
                        {
                            console.log(err || data);
                        });

                        //redirect to login container
                        response.writeHead(OK, {"Content-Type": types['html']})
                        response.write(renderedHTML);
                        response.end()
                    }
                    //if valid email and password
                    else
                    {
                        //login (cookies etc.)
                        console.log("successfully logged in");
                        
                        // sync
                        var buf = crypto.randomBytes(256);
                        // let hexSessionID = toHexString(buf);
                        let hexSessionID = buf.toString('hex');
                        
                        response.setHeader('Set-Cookie', ["session = " + hexSessionID]);

                        cookieMap.set(hexSessionID, email);

                        // console.log(cookieMap);

                        response.writeHead(302,  {Location: "/index.html"});
                        response.end();
                    }
                }
            });

            
        }
        //============= END SUBMIT LOGIN =============//

        //============= FILE DELIVERY =============//
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

            //============= DYNAMIC FILE DELIVERY =============//


            //============= LOCATION PAGE DYNAMIC FILE DELIVERY =============//
            if(locationPages.includes(requestedURL.substring(1)))
            {
                let pageName = requestedURL.substring(1,requestedURL.length-5);
                // await render()
                var ps = await db.prepare("select * from comments where page = ?");
                // let comments = await db.all("select * from comments where page = '"+pageName+"'")
                let comments = await ps.all(pageName);
                await ps.finalize();
                let htmlContent = await fs.readFile('./views/'+pageName+'.ejs', 'utf8');

                var renderedHTML;
                if(cookieMap.has(currentSessionID))
                {
                    renderedHTML = await ejs.render(htmlContent, { signuplogin: "Signed in as: " +sessionUsername,comments:comments,username:"Posting as: " +sessionUsername,isdisabled:"" }, function(err, data) 
                    {
                        console.log(err || data)
                    });
                }
                else
                {
                    renderedHTML = await ejs.render(htmlContent, {signuplogin: "Signup/Login",comments:comments,username: "You must be logged in to comment", isdisabled:"disabled"}, function(err, data) 
                    {
                        console.log(err || data)
                    });
                }

                // let renderedHTML = await ejs.render(htmlContent, {comments:comments}, function(err, data) 
                // {
                //     console.log(err || data)
                // }); 

                response.writeHead(OK, {"Content-Type": types['html']})
                response.write(renderedHTML);
                response.end();
            }
            //============= END LOCATION PAGE DYNAMIC FILE DELIVERY =============//

            //dynamically deliver main page/all locations page so we can show logged in user
            else if(requestedURL == "/index.html" || requestedURL == "/all-locations.html")
            {
                let pageName = requestedURL.substring(1,requestedURL.length-5);
                let htmlContent = await fs.readFile('./views/'+pageName+'.ejs', 'utf8');

                //if logged in
                if(cookieMap.has(currentSessionID))
                {
                    let renderedHTML = await ejs.render(htmlContent, {signuplogin: "Signed in as: " +sessionUsername }, function(err, data) 
                    {
                        console.log(err || data)
                    });

                    response.writeHead(OK, {"Content-Type": types['html']})
                    response.write(renderedHTML);
                    response.end();
                }
                else
                {
                    //else:
                    let renderedHTML = await ejs.render(htmlContent, {signuplogin:"Signup/Login"}, function(err, data) 
                    {
                        console.log(err || data)
                    });

                    response.writeHead(OK, {"Content-Type": types['html']})
                    response.write(renderedHTML);
                    response.end();
                }
            }

            else if(requestedURL == "/signup-login.html")
            {
                //If logged in, redirect
                if(cookieMap.has(currentSessionID))
                {
                    response.writeHead(302, {Location: "/index.html","Content-Type": types['html']});
                    response.end();
                }
                else
                {
                    await deliver(response, type, content);
                }
            }
            //============= END DYNAMIC FILE DELIVERY =============//


            //============= STATIC FILE DELIVERY =============//
            //Else, deliver a static file
            else
            {
                await deliver(response, type, content);
            }
            //============= END STATIC FILE DELIVERY =============//
        }
        //============= END FILE DELIVERY =============//

    } 
    catch (error)
    {
        //Print the error
        console.log("error caught!");
        console.log(error);
        //Exit
        return fail(response, errorCode, error.toString());
    }
}

//checks if user is submitting a comment
// ?submit-comment
async function checkIfComment(url)
{
    let n = url.lastIndexOf("?");
    if(url.substring(n+1) == "submit-comment")
    {
        return true;
    }
    else
    {
        return false;
    }
}

async function checkIfLogIn(url)
{
    let n = url.lastIndexOf("?");
    if(url.substring(n+1) == "submit-login")
    {
        return true;
    }
    else
    {
        return false;
    }
}

async function checkIfSignUp(url)
{
    let n = url.lastIndexOf("?");
    if(url.substring(n+1) == "submit-signup")
    {
        return true;
    }
    else
    {
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

    response.writeHead(OK, typeHeader);
    response.write(content);
    response.end();
}

// Give a minimal failure response to the browser
async function fail(response, code, text) 
{
    // let file = pug.renderFile( './views/index.pug', {title:'yeyeye'} )
    let htmlContent = await fs.readFile('./views/error.ejs', 'utf8');
    let renderedHTML = await ejs.render(htmlContent, {error: text}, function(err, data) 
    {
        console.log(err || data)
    });
    
    response.write(renderedHTML);
    response.end();
}



function defineLocationPages()
{
    let locationPages = 
    [
        "tokyo.html"
    ];
    return locationPages;
}

function toHexString(byteArray) 
{
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}




function defineTypes() 
{
    let types = 
    {
        html : "text/html",
        // html : "application/xhtml+xml",
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