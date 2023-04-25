/**
  * Módulo para la gestión de comunicación de red.

// Conexión de nuevos usuarios.
 - El usuario se conecta y envia el nombre de usuario tras realizar conexión.
 - El servidor recibe el nombre de usuario y lo reenvia a los demás usuarios.
 - Los usuarios reciben el nombre y notifican su frontend.

  */

import * as websocketConstants from '/js/constants/websocket-constants.js';

import * as game from '/js/game/game.js';

import * as gameMenuUiJoinRoom from '/js/game/game-menu-ui-joinroom.js';

import * as websocketData from '/js/websocket/websocket-data.js';

/** Zócalo de comunicación. */
export let socket = null;
/** Indicar si se ha conectado con el servidor. */
export let connected = false;
/** Indicar si ha habido un error con el servidor. */
export let error = false;
/** Mensaje de error. */
export let errorMessage = '';

/**
  * Función de inicialización del módulo.
  */
export function init() {
	
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
		
		// Informar del nombre de usuario.
		sendMessage({
			code: websocketConstants.SERVER_CODE_GLOBAL_NEW_PLAYER,
			content: JSON.stringify(game.user)
		});
		
		// Establecer conexión.
		connected = true;
	};
	
	socket.onmessage = function(event) {
		console.log("Info has been received from server: ");
		//console.log(event.data);
		let message = JSON.parse(event.data);
		
		switch (message.code) {
			case websocketConstants.CLIENT_CODE_GLOBAL_NEW_PLAYER: {
				let user = JSON.parse(message.content);
				
				websocketData.addGlobalUser(user);
				
				// Añadir mensaje del sistema.
				gameMenuUiJoinRoom.addChatMessage({
					userId: -2,
					content: user.username + ' has joined the game.'
				});
			} break;
			case websocketConstants.CLIENT_CODE_GLOBAL_CHAT_MESSAGE: {
				let chatMessage = JSON.parse(message.content);
				
				websocketData.addGlobalChat(chatMessage);
			} break;
			case websocketConstants.CLIENT_CODE_GLOBAL_PLAYER_LEFT: {
				let user = JSON.parse(message.content);
				
				websocketData.removeGlobalUser(user);
				
				// Añadir mensaje del sistema.
				gameMenuUiJoinRoom.addChatMessage({
					userId: -2,
					content: user.username + ' has left the game.'
				});
			} break;
			case websocketConstants.CLIENT_CODE_GLOBAL_PLAYER_LIST: {
				let users = JSON.parse(message.content);
				
				// Añadirse a si mismo.
				websocketData.addGlobalUser(game.user);
				
				for (let i = 0; i < users.length; ++i) {
					websocketData.addGlobalUser(users[i]);
				}
			} break;
			case websocketConstants.CLIENT_CODE_GLOBAL_ROOM_LIST: {
				let rooms = JSON.parse(message.content);
				
				for (let i = 0; i < rooms.length; ++i) {
					websocketData.addGlobalRoom(rooms[i]);
				}
			} break;
			case websocketConstants.CLIENT_CODE_GLOBAL_ROOM_ID: {
				console.log('room created');
				console.log(JSON.parse(message.content));
			} break;
		}
	};
	
	socket.onclose = function(event) {
		if (event.wasClean) {
			console.log("The socket has cleanly closed the connection to the server.");
		} else { // event.wasClean == 1006 → no está conectado.
			console.log("There was an error while connecting to the server: ");
			console.log(event);
			
			// Indicar que hay error.
			error = true;
			errorMessage = event;
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
	// Vaciar datos.
	websocketData.clean();
	
	// Establecer conexión.
	connected = false;
}

/**
  * Función para enviar datos, siempre y cuando se encuentre conectado al servidor.
  *
  * @param message el objeto mensaje.
  */
export function sendMessage(message) {
	if (socket.readyState) {
		socket.send(JSON.stringify(message));
	} else {
		console.error('Could not send message because socket is not on ready state.');
	}
}

/**
  * Función para enviar un mensaje de chat global con la cuenta del usuario actual.
  *
  * @param messageContent el contenido del mensaje.
  * @return 0 si se puede enviar el mensaje, -1 si está en blanco el mensaje y -2 si es demasiado largo.
  */
export function sendGlobalChatMessage(messageContent) {
	if (!!messageContent?.trim()) {
		if (messageContent.length < 512) {
			let message = {
				userId: game.user.userId,
				username: game.user.username,
				content: messageContent
			};
			
			websocketData.addGlobalChat(message);
			
			// Informar sobre el mensaje.
			sendMessage({
				code: websocketConstants.SERVER_CODE_GLOBAL_CHAT_MESSAGE,
				content: JSON.stringify(message)
			});
		} else {
			return -2
		}
	} else {
		return -1;
	}
	
	return 0;
}

/**
  * Función para crear una sala con la cuenta del usuario actual.
  *
  * @param roomName el nombre de sala.
  * @param password la contraseña de la sala. Si es una cadena vacia se asume que no se crea con contraseña.
  * @param playersMax el número máximo de jugadores.
  * @param gamemode el modo de juego.
  * @param hide indica si a la sala solo pueden entrar los jugadores a los que se pase el código de sala.
  */
export function sendGlobalCreateRoom(roomName, password, playersMax, gamemode, hide) {
	let message = {
		roomId: '', // Vacio
		roomName: roomName,
		players: '', // Vacio
		playersMax: playersMax,
		gamemode: gamemode,
		hide: hide,
		password: password
	};
	
	// Informar sobre la sala creada.
	sendMessage({
		code: websocketConstants.SERVER_CODE_GLOBAL_CREATE_ROOM,
		content: JSON.stringify(message)
	});
}

/**
  * Función para reiniciar el estado de error de conexión.
  */
export function resetError() {
	error = false;
	errorMessage = '';
}
