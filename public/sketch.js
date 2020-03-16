// Starter project credits below:
// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;
var codeString;
var input;
var codeToSend = "";

function setup() {
  createCanvas(600, 600);
  background(0);

    input = createInput();
    input.position(30, 255);
    //input.width = 200;

    button = createButton('submit code');
    button.position(input.x + input.width+10, input.y);
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
            fill(255,0,0,120);
            eval(codeString);

        }
    );
}

function draw() {
  // Nothing
    //sendCheckUpdates();
    //eval(codeString);
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
    sendCheckUpdates();


}
