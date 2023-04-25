/**
  * Módulo para la gestión de comunicación de red.
  */

let socket;

document.querySelector("#buttonConnect").onclick = function() {
	this.innerText = "Reconnect";
	document.querySelector("#status").innerText = "Connected";
	
	if (socket != null) {
		socket.close();
	}
	socket = new WebSocket(SERVER_ADDRESS);
	
	socket.onopen = function(e) {
		console.log("Succesfully conected to " + SERVER_ADDRESS);
		socket.send("Hola soy Carlos!");
	};
	
	socket.onmessage = function(event) {
		console.log("Info has been received from server: ");
		console.log(event.data);
	};
	
	socket.onclose = function(event) {
		if (event.wasClean) {
			console.log("The socket has cleanly closed the connection to the server.");
		} else { // event.wasClean == 1006 → no está conectado.
			console.log("There was an error while connecting to the server: ");
			console.log(event);
			
			document.querySelector("#buttonConnect").innerText = "Reconnect";
			document.querySelector("#status").innerText = "Disconnected";
		}
	};
	
	socket.onerror = function(error) {
		console.log("Connection error: ");
		console.log(error);
		//alert("Disconnected from server.");
	};
};

document.querySelector("#buttonConnect").click();

document.querySelector("#chatSend").onclick = function() {
	if (socket.readyState) {
		socket.send(document.querySelector("#chatBox").value);
		chatBox.value = "";
	}
}
