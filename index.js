const parseUrl = require('parse_url');
const platformsh = require('platformsh-config');
const fs = require('fs');
const uuidv4 = require('uuid/v4')

var express = require('express');

//var screenshots = require("./screenshots.js");

// Get the credentials for headless Chrom
let config = platformsh.config();
const credentials = config.credentials('headless');

// Create a randomly generated ID number for the current demo
var screenshotID = uuidv4();
var pdfID = uuidv4();

// Define each example
var data = {};

let examples = {
    pdfs: 'PDFs',
    screenshots: 'Screenshots',
};

Object.keys(examples).forEach((key) => {
    data[key] = require(`./examples/${key}.js`);
    data[key].source = fs.readFileSync(`./examples/${key}.js`, 'utf8');
    data[key].label = examples[key];
});

// Build the application
var app = express()

app.get('/', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(`<html>
<head>
    <title>Headless Chrome on Platform.sh</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
    <script src="./examples/screenshots.js">
    $(document).ready(function(){
      $("#hiddenResultSS").hide()
      $("#submit").click(function(){
        takeScreenshot(urlScreenshot.value, screenshotID)
        $("#hiddenResultSS").show();
      });
    });
    </script>
</head>
<body>
<h1>Headless Chrome on Platform.sh</h1>

<a href="/relationship">Relationship</a>

<h2>Puppeteer usage examples</h2>

<h3>Take a Screenshot of a page(<a href="/examples/screenshot">Source</a>)</h3>

<input type="text" id="urlScreenshot" name="urlScreenshot2"/>
<button id="submit">Submit</button>
<a id="hiddenResultSS" href="/screenshots/result">Result</a>

<ul>
  <li><a href="/examples/screenshot">Source</a></li>
</ul>




<h3>Make a PDF copy of a page (<a href="/examples/pdf">Source</a>)</h3>

<form action="/examples/pdfs.js">
<input type="text" name="urlPDF" value="Enter a url"><input type="submit" value="Submit">
</form>

<ul>
  <li><a href="/examples/pdf">Source</a></li>
</ul>
`);
    res.end(`</body></html>`);
})

// Relationship JSON
app.get('/relationship', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end("<html><head><title>Relationship</title></head><body><pre>"+JSON.stringify(credentials, null, 4) + "</pre></body></html>");
})


// Screenshot source
app.get('/examples/screenshot', (req, res) => {
  res.write(data['screenshots'].source)
})

// PDF source
app.get('/examples/pdf', (req, res) => {
  res.write(data['pdfs'].source)
})

// Screenshot result
app.get('/screenshots/result', function(req, res){
  const file = `screenshots/example.png`;
  res.download(file); // Set disposition and send it.
});

// PDF result
app.get('/pdfs/result', function(req, res){
  const file = `pdfs/${pdfID}.png`;
  res.download(file); // Set disposition and send it.
});

// Start the server.
app.listen(config.port, function() {
    console.log(`Listening on port ${config.port}`)
});
