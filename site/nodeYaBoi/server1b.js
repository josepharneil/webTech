let HTTP = require("q-io/http");
start(8080);

// Provide a service to localhost only.
async function start(port) 
{
  let service = HTTP.Server(handle);
  await service.listen(port, 'localhost');
  console.log("Visit localhost:" + port);
}

// Deal with a request.
async function handle(request, response) 
{
  console.log("Method:", request.method);
  console.log("URL:", request.url);
  console.log("Headers:", request.headers);
  let body = await request.body.read();
  console.log("Body:", body.toString());
  response.status = 200;
  response.headers = {'Content-Type': 'text/plain'};
  response.body = ["OK"];
  return response;
}
