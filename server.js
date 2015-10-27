var config = require('./webpack.config');
var http = require('http');
var path = require('path');
var url = require('url');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var port = process.env.PORT || 5000;

var server = new WebpackDevServer(webpack(config), config.devServer);

// Important part. Send down index.html for all requests
server.use('/', function (req, resp, next) {
  var opts = url.parse('http://localhost:8080');
  opts.method = req.method;
  opts.headers = req.headers;

  var myReq = http.request(opts, function (myRes) {
    var statusCode = myRes.statusCode;
    var headers = myRes.headers;
    var location = headers.location;

    if (200 !== statusCode) {
      next();

      return;
    }

    resp.writeHead(myRes.statusCode, myRes.headers);
    myRes.on('error', function (err) {
      next(err);
    });
    myRes.pipe(resp);
  });
  myReq.on('error', function (err) {
    next(err);
  });

  if (!req.readable) {
    myReq.end();
  } else {
    req.pipe(myReq);
  }
});

server.listen(port, 'localhost', function() {
  console.log('Listening on http://localhost:' + port);
});
