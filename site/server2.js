// Server which delivers only static HTML pages (no content negotiation).
// Response codes: see http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// When the global data has been initialised, start the server.
let HTTP = require('http');
let FS = require('fs').promises;
let OK = 200, NotFound = 404, BadType = 415;
start(8080);

// Provide a service to localhost only.
function start(port) {
  let service = HTTP.createServer(handle);
  try { service.listen(port, 'localhost'); }
  catch (err) { throw err; }
  console.log("Visit localhost:" + port);
}

// Deal with a request.
async function handle(request, response) {
  let url = request.url;
  if (url.endsWith("/")) url = url + "index.html";
  if (! url.endsWith(".html")) return fail(response, BadType, "Not .html");
  let file = "./public" + url;
  let content;
  try { content = await FS.readFile(file); }
  catch (err) { return fail(response, NotFound, "Not found"); }
  reply(response, content);
}

// Send a reply.
function reply(response, content) {
  let hdrs = { 'Content-Type': 'application/xhtml+xml' };
  response.writeHead(OK, hdrs);
  response.write(content);
  response.end();
}

// Send a failure message
function fail(response, code, message) {
  let hdrs = { 'Content-Type': 'text/plain' };
  response.writeHead(code, hdrs);
  response.write(message);
  response.end();
}