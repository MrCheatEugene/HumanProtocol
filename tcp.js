const Net = require('net');
const sha256 = require('js-sha256');        
const fs  = require ('fs');
const settings = JSON.parse(fs.readFileSync('settings.json'));
const server = new Net.Server();
server.listen(settings.port, function() {
    console.log(`Server listening for connection requests on socket localhost:${settings.	port}`);
});

server.on('connection', function(socket) {
    console.log('A new connection has been established.');
    var input = "";
    var authAttempts = 0;
    var waitForInput = "login";
    var authSuccess = false;
    var userIndex = 0;
    socket.write('Hello\n');
    socket.on('data', function(chunk) {
	if(chunk.toString() !== "\r\n"){
	input=input+chunk.toString(); 
	}else{
        switch(input){            
        case "Hello":
        if(authSuccess!==true){
            //input = "";
            socket.write("Who are you?\n");
            waitForInput = "name";
            break;
        }else{
            //input = "";
            if (authSuccess == true) {
            //input = "";
            socket.write("Are you ok?\n");
            break;
            }else{
            //input = "";
            socket.write("Are you ok? Please answer the previous question!\n");
            break;
        }
        }
        case "Bye":
        input ="";
        waitForInput = "none";
        socket.write("See you later!\n");
        socket.end();
            break;
        default:
        if (waitForInput == "none") {
            //input = "";
            socket.write("Sorry, i did not understood you.\n");     
            break;
        }
        if(waitForInput == "name" && settings.users.indexOf(input) !==-1){
            if (settings.guestAccess == 0) {
            userIndex = parseInt(settings.users.indexOf(input));
            waitForInput = "passphrase";
            authAttempts = 0;
            //input = "";
            socket.write("Okay, now, what's your passphrase?\n");
            break;
            }else{
                waitForInput="none";
                socket.write("Success!\n");
                authSuccess = true;
                break;
            }
        }else{
            if (waitForInput == "name" && settings.users.indexOf(input) ==-1 && (parseInt(settings.authAttempts) !== authAttempts)  ) {
            waitForInput = "failed_name";
            authAttempts++;
            socket.write(`Who are you? If you don't say the proper name ${settings.authAttempts-authAttempts} more times, I will end you right now.\n`);
            break;
            }
            if (waitForInput == "passphrase" && sha256(input) == settings.passwords[userIndex]) {
                //input = "";
                waitForInput="none";
                socket.write("Success!\n");
                authSuccess = true;
                break;
            }else{
                if (waitForInput == "passphrase" && authAttempts>=parseInt(settings.authAttempts)) {
                    //input = "";
                    waitForInput="none";
                    socket.write("Get lost, idiot.\n");
                    socket.end();
                    break;
                }else{
                if (waitForInput == "passphrase" &&  sha256(input) !== settings.passwords[userIndex]) {
                    authAttempts++;
                    socket.write(`What's your passphrase? If you don't say the proper passphrase ${settings.authAttempts-authAttempts} more times, I will end you right now.\n`);
                    break;
                }
            }
            }
            if (waitForInput == "failed_name" && (authAttempts !== parseInt(settings.authAttempts)) && settings.users.indexOf(input) !==-1) {
            waitForInput = "passphrase";
            //input = "";
            authAttempts = 0;
            userIndex = parseInt(settings.users.indexOf(input));
            socket.write("Okay, now, what's your passphrase?\n");       
            break;
            }else{
                if (waitForInput == "failed_name" && authAttempts>=parseInt(settings.authAttempts)) {
                    //input = "";
                    waitForInput="none";
                    socket.write("Get lost, idiot.");
                    socket.end();
                    break;
                }else{
                    if(waitForInput == "failed_name"){
                    waitForInput = "failed_name";
                    //input = "";
                    socket.write(`Who are you? If you don't say the proper name ${settings.authAttempts-authAttempts} more times, I will end you right now.\n`);
                    authAttempts++;
                    break;
                }
                }
            }
            //break;
        }
        socket.write("Sorry?\n");     
        break;
    }
    input = "";
	}

    });

    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});