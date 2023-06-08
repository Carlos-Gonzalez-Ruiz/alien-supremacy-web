/**
  * Módulo de constantes de comunición de red websocket.
  *
  */

/** Dirección del servidor principal. */
export const SERVER_ADDRESS = (location.protocol == 'http:' ? 'ws://' : 'wss://') + 'alien-supremacy-server.onrender.com/server';
//export const SERVER_ADDRESS = (location.protocol == 'http:' ? 'ws://' : 'wss://') + location.hostname + ':8090/server';

/* Cliente → Servidor */

/** Código de mensaje de nuevo jugador en el listado de salas. (Cliente → Servidor)
 * 
 * Contenido:
 * 	{
 * 		"userId": "...",
 * 		"username": "..." 
 * 	}
 */
export const SERVER_CODE_GLOBAL_NEW_PLAYER = 1;

/** Código de mensaje de mensaje de chat en el listado de salas. (Cliente → Servidor)
 * 
 * Contenido:
 * 	{
 * 		"userId": "...",
 * 		"username": "...", 
 * 		"message": "..."
 * 	}
 */
export const SERVER_CODE_GLOBAL_CHAT_MESSAGE = 2;

/** Código de mensaje de jugador sale del listado de salas. (Cliente → Servidor)
 * 
 * Contenido:
 * 	{
 * 		"userId": "...",
 * 		"username": "..." 
 * 	}
 */
export const SERVER_CODE_GLOBAL_PLAYER_LEFT = 3;

/** Código de mensaje para crear sala. (Cliente → Servidor)
 * 
 * Contenido:
 * 	{
 * 		"roomId": "...", // Vacio
 * 		"roomName": "...",
 * 		"players": "...", // Vacio
 * 		"playerMax": "...",
 * 		"gamemode": "...",
 * 		"hide": "...",
 * 		"password": "..."
 * 	}
 */
export const SERVER_CODE_GLOBAL_CREATE_ROOM = 4;

/* Servidor → Cliente */

/** Código de mensaje de nuevo jugador en el listado de salas. (Servidor → Cliente)
 * 
 * Contenido:
 * 	{
 * 		"userId": "..."
 * 		"username": "..." 
 * 	}
 */
export const CLIENT_CODE_GLOBAL_NEW_PLAYER = 1;

/** Código de mensaje de mensaje de chat en el listado de salas. (Servidor → Cliente)
 * 
 * Contenido:
 * 	{
 * 		"userId": "...",
 * 		"username": "...",
 * 		"message": "..."
 * 	}
 */
export const CLIENT_CODE_GLOBAL_CHAT_MESSAGE = 2;

/** Código de mensaje de jugador sale del listado de salas. (Servidor → Cliente)
 * 
 * Contenido:
 * 	{
 * 		"userId": "...",
 * 		"username": "..." 
 * 	}
 */
export const CLIENT_CODE_GLOBAL_PLAYER_LEFT = 3;

/** Código de mensaje para enviar todos los jugadores que hay globalmente (Servidor → Cliente)
 * 
 * Contenido:
 * 	[
 * 		{
 * 			"userId": "...",
 * 			"username": "..."
 * 		}, 
 *   	]
 */
export const CLIENT_CODE_GLOBAL_PLAYER_LIST = 4;

/** Código de mensaje para enviar todas las salas que hay globalmente (Servidor → Cliente)
 * 
 * Contenido:
 * 	[
 * 		{
 * 			"roomId": "...",
 * 			"roomName": "...",
 * 			"players": "...",
 * 			"playerMax": "...",
 * 			"gamemode": "...",
 * 			"hide": "...",
 * 			"password": "..." // Vacio
 * 		}, 
 *  	]
 */
export const CLIENT_CODE_GLOBAL_ROOM_LIST = 5;

/** Código de mensaje para obtener los datos de la sala creada por el cliente. (Servidor → Cliente)
 * 
 * Contenido:
 * 	{
 * 		"roomId": "...",
 * 		"roomName": "...",
 * 		"players": "...",
 * 		"playerMax": "...",
 * 		"gamemode": "...",
 * 		"hide": "...",
 * 		"password": "..." // Vacio
 * 	}
 */
export const CLIENT_CODE_GLOBAL_ROOM_ID = 6;
