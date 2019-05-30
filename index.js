const parseUrl = require('parse_url');
const platformsh = require('platformsh-config');

let config = platformsh.config();

const credentials = config.credentials('chrome');

var express = require('express');

var relationship = JSON.stringify(credentials, null, 4);

var app = express()

app.get('/', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
//  res.send('Hello World! <a href="/test">Test page</a>')
  res.write(`<html>
<head>
    <title>Headless Chrome on Platform.sh</title>
</head>
<body>
<h1>Headless Chrome on Platform.sh</h1>
<h2>Relationship</h2>
<p>${relationship}</p>
<a href="/relationship">Test page</a>


<h2>Usage examples</h2>
<ul>
  <li><a href="/test">Test page</a></li>
  <li><a href="/test">Test page</a></li>
  <li><a href="/test">Test page</a></li>
</ul>
`);
    res.end(`</body></html>`);
})


app.get('/relationship', (req, res) => {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.end("<html><head><title>Relationship</title></head><body><pre>"+JSON.stringify(credentials, null, 4) + "</pre></body></html>");
})


app.get('/test', (req, res) => {
  res.send('Another page!')
})



// Start the server.
app.listen(config.port, function() {
    console.log(`Listening on port ${config.port}`)
});
