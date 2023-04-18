/**
  * Módulo para la gestión de comunicación de red.
  */

import * as websocketConstants from '/js/constants/websocket-constants.js';

/** Zócalo de comunicación. */
export let socket = null;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	connect();
	//sendChatMessage('test');
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	
}

/**
  * Función para conectarse al servidor principal.
  */
export function connect() {
	disconnect();
	
	socket = new WebSocket(websocketConstants.SERVER_ADDRESS);
	
	// Definir comportamiento de la comunicación de sockets.
	socket.onopen = function(e) {
		console.log("Succesfully conected to " + websocketConstants.SERVER_ADDRESS);
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
		}
	};
	
	socket.onerror = function(error) {
		console.log("Connection error: ");
		console.log(error);
		//alert("Disconnected from server.");
	};	
}

/**
  * Función para desconectarse del servidor principal.
  */
export function disconnect() {
	if (socket != null) {
		socket.close();
	}
}

/**
  * Función para enviar, siempre y cuando se encuentre conectado al servidor.
  *
  * @param message el mensaje.
  */
export function sendChatMessage(message) {
	if (socket.readyState) {
		socket.send(message);
	}
}
