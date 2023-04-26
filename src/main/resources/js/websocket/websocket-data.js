/**
  * Módulo para el registro de datos obtenidos mediante websocket.
  */

import * as gameMenuUiJoinRoom from '/js/game/game-menu-ui-joinroom.js';

/** Array de usuarios global. */
export let globalUsers = [];
/** Array de mensajes de chat global. */
export let globalChatMessages = [];
/** Array de salas a unirse. */
export let globalRooms = [];

/**
  * Función para resetear valores tras finalizar la conexión.
  */
export function clean() {
	globalUsers = [];
	globalChatMessages = [];
	globalRooms = [];
}

/**
  * Función para añadir un nuevo usuario al array de usuarios, actualizando el estado de la interfaz.
  *
  * @param user objeto con los datos del usario.
  */
export function addGlobalRoom(room) {
	globalRooms.push(user);
	globalRooms.sort(function(a, b) {
		return a.roomName.localeCompare(b.roomName);
	});
	gameMenuUiJoinRoom.refreshUserList(globalRooms);
}

/**
  * Función para eliminar un nuevo usuario al array de usuarios, actualizando el estado de la interfaz.
  *
  * @param user objeto con los datos del usario.
  */
export function removeGlobalRoom(room) {
	globalRooms = globalRooms.filter(function(element) {
		return element.roomId != room.roomId;
	});
	gameMenuUiJoinRoom.refreshRoomList(globalRooms);
}

/**
  * Función para añadir un nuevo usuario al array de usuarios, actualizando el estado de la interfaz.
  *
  * @param user objeto con los datos del usario.
  */
export function addGlobalUser(user) {
	globalUsers.push(user);
	globalUsers.sort(function(a, b) {
		return a.username.localeCompare(b.username);
	});
	gameMenuUiJoinRoom.refreshUserList(globalUsers);
}

/**
  * Función para eliminar un nuevo usuario al array de usuarios, actualizando el estado de la interfaz.
  *
  * @param user objeto con los datos del usario.
  */
export function removeGlobalUser(user) {
	globalUsers = globalUsers.filter(function(element) {
		return element.userId != user.userId || element.username != user.username;
	});
	gameMenuUiJoinRoom.refreshUserList(globalUsers);
}

/**
  * Función para añadir un nuevo mensaje al chat global, actualizando el estado de la interfaz.
  *
  * @param message objeto con el mensaje de chat.
  */
export function addGlobalChat(message) {
	globalChatMessages.push(message);
	gameMenuUiJoinRoom.addChatMessage(message);
}
