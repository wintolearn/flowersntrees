// Starter project credits below:
// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;
var codeString;
var input;
var codeToSend = "";

var clearInput;
var error = false;

function setup() {
  createCanvas(600, 600);
  background(0);
    var inputY = 265;
    input = createInput();
    input.position(30, inputY);
    button = createButton('submit code');
    button.position(input.x + input.width+10, input.y);
    //button gets clicked, call updateCode
    button.mousePressed(updateCode);

    clearInput = createInput();
    clearInput.position(30+250, input.y);
    buttonClear = createButton('enter password to clear all code');
    buttonClear.position(input.x+250 + input.width+10, input.y);
    //button gets clicked, call updateCode
    buttonClear.mousePressed(clearCode);

  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  //socket = io.connect('http://localhost:8080');
    socket = io();
  // We make a named event called 'mouse' and write an
  // anonymous callback function


  socket.on('codeString',
        // When we receive data
        function(data) {
            //console.log("Got: " + data);
            eval(data);

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

    console.log("check updates "+codeToSend);

    // Send that object to the socket
    socket.emit('checkUpdates',codeToSend);
}

// Get the code from the input box
function updateCode() {
    //set the global variable equal to the value in the input box
    codeToSend = input.value();
    codeToSend="translate(width/2,height/2);"+codeToSend;
    console.log('code to Send: '+codeToSend);
    //eval("ellipse(100,100,100,100);");
    //check code first on client browser to see if it works

    try {
        //run the code in the client browser
        console.log('running eval: '+codeToSend);
        //eval("ellipse(100,100,100,100);");
        eval(codeToSend);
    } catch (e) {
        error = true;
        console.log('error');
        if (e instanceof SyntaxError) {
            console.log(e.message);
        }

    }
    if(!error){
        console.log('send check updates: '+error);
        sendCheckUpdates();
    }
    error=false;





}

function clearCode(){
    var data = "";
    console.log(clearInput.value());
    if(clearInput.value()==="clearit") {
        socket.emit('clearCode', data);
    }

}
