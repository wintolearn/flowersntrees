// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;
var codeString;
var input;
var codeToSend = "";

function setup() {
  createCanvas(400, 400);
  background(0);

    input = createInput();
    input.position(20, 65);

    button = createButton('submit');
    button.position(input.x + input.width, 65);
    button.mousePressed(updateCode);

  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  //socket = io.connect('http://localhost:8080');
    socket = io();
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
      // Draw a blue circle
      fill(0,0,255);
      noStroke();
      ellipse(data.x, data.y, 20, 20);
    }
  );

  socket.on('codeString',
        // When we receive data
        function(data) {
            //console.log("Got: " + data);
            codeString = data;

            // Draw a blue circle
            fill(0,0,255);
            eval(codeString);
            //noStroke();
            //ellipse(data.x, data.y, 20, 20);
        }
    );
}

function draw() {
  // Nothing
    sendCheckUpdates();
    //eval(codeString);
}

function mouseDragged() {
  // Draw some white circles
  fill(255);
  noStroke();
  ellipse(mouseX,mouseY,20,20);
  // Send the mouse coordinates
  sendmouse(mouseX,mouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);

  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}

// Function to check for updates
function sendCheckUpdates() {
    // We are sending!


    var data = codeToSend;

    console.log("check updates "+codeToSend);

    // Send that object to the socket
    socket.emit('checkUpdates',data);
}

// Function to append to text file
function updateCode() {
    codeToSend = input.value();
    console.log(codeToSend);
    // We are sending!
    //console.log("send code to append");
    //var data = "";

    // Send that object to the socket
    //socket.emit('checkUpdates',data);
    //socket.emit('Append',data);

}
