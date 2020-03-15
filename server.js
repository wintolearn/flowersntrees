// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
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

/*
fs.writeFile('public/helloworld.txt', 'Hello my friends!', function (err) {
    if (err) return console.log(err);
    console.log('Hello World > helloworld.txt');
});
*/

fs.readFile('public/helloworld.txt','utf8', function (err,data) {
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

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);

        // Send it to all other clients
        socket.broadcast.emit('mouse', data);

        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );

        socket.on('checkUpdates',
          function(data) {
              // Data comes in as whatever was sent, including objects
              console.log("Received: checkUpdates");

              if(data !== "") {
                  fs.appendFile('public/helloworld.txt', data, function (err) {
                      if (err) return console.log(err);
                      //codeString = data;
                      //console.log(codeString);
                  });
              }

              fs.readFile('public/helloworld.txt','utf8', function (err,data) {
                  if (err) return console.log(err);
                  codeString = data;
                  //console.log(codeString);
              });
              io.sockets.emit('codeString', codeString);


          }
      );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);