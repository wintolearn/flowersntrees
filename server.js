// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


// Set up the server
// process.env.PORT is related to deploying on heroku or openshift etc
var server = app.listen(process.env.PORT || 8080, listen);

var codeString;


// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

fs = require('fs');


fs.readFile('public/p5code.txt','utf8', function (err,data) {
    if (err) return console.log(err);
    codeString = data;
    console.log(codeString);
});


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // Let's try to send a code string
      io.sockets.emit('codeString', codeString);

        socket.on('checkUpdates',
          function(data) {
              // Data comes in as whatever was sent, including objects
              console.log("Received: checkUpdates");

              if(data !== "") {
                  data = data + "\r\n" + "resetMatrix();" + "\r\n";
                  fs.appendFile('public/p5code.txt', data, function (err) {
                      if (err) return console.log(err);
                  });
              }

              fs.readFile('public/p5code.txt','utf8', function (err,data) {
                  if (err) return console.log(err);
                  codeString = data;
              });
              io.sockets.emit('codeString', codeString);

          }
      );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);