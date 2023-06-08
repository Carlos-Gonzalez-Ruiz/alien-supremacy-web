/**
  * Módulo para la sección de unirse a sala del menú del juego.
  */

import * as domUi from '/js/dom-ui/dom-ui.js';

import * as websocket from '/js/websocket/websocket.js';

import * as game from '/js/game/game.js';
import * as audio from '/js/game/audio.js';

import * as gameMenuUi from '/js/game/game-menu-ui.js';
import * as gameMenuUiRoom from '/js/game/game-menu-ui-room.js';

import * as galaxy from '/js/game/scene/galaxy.js';

/** Lista de elementos. */
let elements = [];
/** Caja de sección de salas. */
let joinRoomBox;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	initDomUi();
}

/**
  * Función de inicialización de domUi.
  */
function initDomUi() {
	// Caja de unirse a sala.
	joinRoomBox = domUi.createScrollableElement(`
		<div style="margin: 4em; width: calc(100vw - (4em * 2.5)); height: calc(100vh - (4em * 2.5));">
			<div style="display: flex;">
				<div style="flex: 1; max-width: fit-content; margin: 1em">
					<button data-title="Go back to the menu" class="game go-back"><i class="bi bi-arrow-left"></i></button>
				</div>
				<div style="flex: 1;">
					<div class="box" style="margin-bottom: 1em; text-align: center;">
						<div class="box-title-simple">
							<h2><i class="bi bi-people-fill"></i> Join Room</h2>
						</div>
						<div class="box-description">
							<p>Join a room and play multiplayer.</p>
						</div>
					</div>
					
					<div style="display: flex; gap: 1em; height: calc(100vh - 4em * 5);">
						<div style="flex: 3; z-index: 999;">
							<div class="box" style="height: 100%;">
								<div class="box-title">
									<i class="bi bi-hdd-stack-fill"></i>
									Rooms
								</div>
								<div style="display: flex; align-items: center; margin-bottom: 1em;">
									<div style="flex: 1; color: #AAA;">
										Showing <span class="rooms-amount"></span> rooms.
									</div>
									<div style="flex: 1; text-align: right;">
										<button data-title="Create new room" class="game create-room">Create room</button>
									</div>
								</div>
								<div class="box-content" style="height: calc(100% - 6em);">
									<table class="rooms">
										<colgroup>
											<col span="1" style="width: 0%;">
											<col span="1" style="width: 65%;">
											<col span="1" style="width: 25%;">
											<col span="1" style="width: 0%;">
										</colgroup>
										<tr>
											<th data-title="Indicates whether new users can join this room">?</th>
											<th>Room name</th>
											<th data-title="Indicates what game mode is being played currently in the room">Game mode</th>
											<th>Users</th>
										</tr>
										<!--
										<tr>
											<td style="color: red;"><i class="bi bi-person-x-fill"></i></td>
											<td>First room ever</td>
											<td>Supremacy</td>
											<td><div style="text-align: center;">2 / 8</div></td>
										</tr>
										<tr>
											<td style="color: white;"><i class="bi bi-person-check-fill"></i></td>
											<td>Second room</td>
											<td>KOH</td>
											<td><div style="text-align: center;">4 / 6</div></td>
										</tr>
										<tr>
											<td style="color: white;"><i class="bi bi-person-check-fill"></i></td>
											<td>Second room</td>
											<td>KOH</td>
											<td><div style="text-align: center;">4 / 6</div></td>
										</tr>
										<tr>
											<td style="color: white;"><i class="bi bi-person-check-fill"></i></td>
											<td>Second room</td>
											<td>KOH</td>
											<td><div style="text-align: center;">4 / 6</div></td>
										</tr>
										<tr>
											<td style="color: white;"><i class="bi bi-person-check-fill"></i></td>
											<td>Second room</td>
											<td>KOH</td>
											<td><div style="text-align: center;">4 / 6</div></td>
										</tr>
										<tr>
											<td style="color: white;"><i class="bi bi-person-check-fill"></i></td>
											<td>Second room</td>
											<td>KOH</td>
											<td><div style="text-align: center;">4 / 6</div></td>
										</tr>
										-->
									</table>
								</div>
							</div>
						</div>
						<div style="flex: 3;">
							<div class="box" style="height: 100%;">
								<div class="box-title">
									<i class="bi bi-chat-fill"></i>
									Global chat
								</div>
								<div class="chat-content" style="height: calc(100% - 6.5em);">
									<div class="box-content chat-messages" style="height: 100%;">
									</div>
									<div style="display: flex; align-items: center; gap: 1em; margin: 1em 0em;">
										<div style="flex: 100%;">
											<input style="width: 100%;" type="text" class="box-content chat-send-message" placeholder="...">
										</div>
										<div style="flex: 1;">
											<button class="game chat-send-message">Send</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div style="flex: 1;">
							<div class="box" style="height: 100%;">
								<div class="box-title">
									<i class="bi bi-people-fill"></i>
									Users
									(<span class="users-amount"></span>)
								</div>
								<div class="box-content" style="height: calc(100% - 3em);">
									<table class="users">
										
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`);
	joinRoomBox.querySelector('button.go-back').onclick = function() {
		gameMenuUi.displayMainMenuBox();
		gameMenuUi.displayRefreshButtonBox();
		gameMenuUi.displayGalaxyNameBox();
		
		hideJoinRoomBox();
		
		// Reproducir sonido.
		audio.soundClick2.play();
		
		// Terminar conexión con el servidor principal.
		stopWebsocket();
	};
	joinRoomBox.querySelector('button.create-room').onclick = function() {
		gameMenuUiRoom.displayRoomBox();
		gameMenuUiRoom.displayStartGameBox();
		gameMenuUiRoom.displaySpectatorBox();
		
		gameMenuUi.displayGalaxyNameBox();
		
		hideJoinRoomBox('fadeOutLeft');
		
		// Adicionalmente, regenerar galaxia.
		galaxy.generateGalaxyAnimated(Math.random());
		
		// Websocket room creation test.
		websocket.sendGlobalCreateRoom('test in test', '', 4, 'supremacy');
		
		// Reproducir sonido.
		audio.soundClick.play();
	};
	joinRoomBox.querySelector('button.chat-send-message').onclick = function() {
		let message = joinRoomBox.querySelector('input[type="text"].chat-send-message').value;
		
		let infoCode = websocket.sendGlobalChatMessage(message);
		switch (infoCode) {
			case 0: default:
			break;
			case -1:
				/*gameMenuUi.displayPopupBox(
					'Could not send message',
					'Message is blank.',
					function() {}
				);*/
			break;
			case -2:
				gameMenuUi.displayPopupBox(
					'Could not send message',
					'Message is too long.',
					function() {
						joinRoomBox.querySelector('input[type="text"].chat-send-message').focus();
					}
				);
			break;
		}
		
		// Vaciar caja de texto.
		joinRoomBox.querySelector('input[type="text"].chat-send-message').value = '';
	};
	joinRoomBox.querySelector('input[type="text"].chat-send-message').onkeydown = function(e) {
		// Enviar mensaje al pulsar 'Enter'.
		if (e.key == 'Enter') {
			let message = this.value;
			
			let info = websocket.sendGlobalChatMessage(message);
			switch (info) {
				case 0: default:
				break;
				case -1:
					/*joinRoomBox.querySelector('input[type="text"].chat-send-message').blur();
					setTimeout(
						function() {
							gameMenuUi.displayPopupBox(
								'Could not send message',
								'Message is blank.',
								function() {
									joinRoomBox.querySelector('input[type="text"].chat-send-message').focus();
								}
							);
						},
						10
					);*/
				break;
				case -2:
					joinRoomBox.querySelector('input[type="text"].chat-send-message').blur();
					setTimeout(
						function() {
							gameMenuUi.displayPopupBox(
								'Could not send message',
								'Message is too long.',
								function() {
									joinRoomBox.querySelector('input[type="text"].chat-send-message').focus();
								}
							);
						},
						10
					);
				break;
			}
			
			this.value = '';
		}
	};
	elements.push(joinRoomBox);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	if (websocket.error) {
		gameMenuUi.displayPopupBox(
			'Network error',
			'There was an error while connecting to the server, try again later.',
			function() {
				gameMenuUi.goToMenu();
			}
		);
		
		websocket.resetError();
	}
}

/**
  * Función para refactorizar el mostrar joinRoomBox.
  *
  * @param animation animación definida a realizar. Opcional.
  */
export function displayJoinRoomBox(animation) {
	domUi.displayElement(joinRoomBox, 0 + 'px', 0 + 'px', 5);
	domUi.setAnimation(joinRoomBox, typeof animation === 'undefined' ? 'fadeInRight' : animation, gameMenuUi.MENU_SECTION_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar galaxyNameBox.
  *
  * @param animation animación definida a realizar. Opcional.
  */
export function hideJoinRoomBox(animation) {
	let time = gameMenuUi.MENU_SECTION_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(joinRoomBox, typeof animation === 'undefined' ? 'fadeOutRight' : animation, time + 's');
	domUi.hideElement(joinRoomBox, time); // Esconder tras un tiempo.
}

/**
  * Función para incializar conexión websocket.
  */
export function startWebsocket() {
	websocket.connect();
}

/**
  * Función para terminar conexión websocket.
  */
export function stopWebsocket() {
	websocket.disconnect();
	
	// Vaciar listas.
	joinRoomBox.querySelector('table.users').innerHTML = '';
	joinRoomBox.querySelector('div.chat-messages').innerHTML = '';
}

/**
  * Función para actulizar la lista de sala, dado un array de datos de salas.
  *
  * @param rooms el array de salas.
  */
export function refreshRoomList(rooms) {
	// Vaciar lista de jugadores.
	joinRoomBox.querySelector('table.rooms').innerHTML = '';
	
	// Añadir jugadores.
	for (let i = 0; i < rooms.length; ++i) {
		// Crear elemento.
		let tableData = document.createElement('td');
		tableData.textContent = rooms[i].roomName;
		
		let tableRow = document.createElement('tr');
		tableRow.appendChild(tableData);
		
		// Permitir visualizar cuenta.
		tableRow.dataset.userId = players[i].userId;
		tableRow.onclick = function() {
			console.log('entrar en sala');
		};
		
		// Añadir elemento.
		joinRoomBox.querySelector('table.rooms').appendChild(tableRow);
	}
	
	// Indicar número de jugadores actuales.
	joinRoomBox.querySelector('span.rooms-amount').textContent = players.length;
}

/**
  * Función para actulizar la lista de jugadores, dado un array de datos de jugadores.
  *
  * @param players el array de jugadores.
  */
export function refreshUserList(players) {
	// Vaciar lista de jugadores.
	joinRoomBox.querySelector('table.users').innerHTML = '';
	
	// Añadir jugadores.
	for (let i = 0; i < players.length; ++i) {
		// Crear elemento.
		let tableData = document.createElement('td');
		tableData.textContent = players[i].username;
		
		let tableRow = document.createElement('tr');
		tableRow.appendChild(tableData);
		
		// Permitir visualizar cuenta.
		tableRow.dataset.userId = players[i].userId;
		tableRow.dataset.username = players[i].username;
		tableRow.onclick = function() {
			gameMenuUi.viewAccount(this.dataset.username, this.dataset.userId);
		};
		
		// Añadir elemento.
		joinRoomBox.querySelector('table.users').appendChild(tableRow);
	}
	
	// Indicar número de jugadores actuales.
	joinRoomBox.querySelector('span.users-amount').textContent = players.length;
}

/**
  * Función para añadir un mensaje al chat global, dado un mensaje.
  * Si el id del usuario es -1, se asume invitado.
  * Si el id del usuario es -2, se asume como mensaje del sistema.
  *
  * @param message el objeto de mensaje.
  */
export function addChatMessage(message) {
	// Elemento de mensaje.
	let div = document.createElement('div');
	
	if (message.userId != -2) {
		// Elemento de cuenta.
		let span = document.createElement('span');
		span.classList.add('chat-username');
		span.textContent = message.username + ' → ';
		span.dataset.userId = message.userId;
		span.dataset.username = message.username;
		span.onclick = function() {
			gameMenuUi.viewAccount(this.dataset.username, this.dataset.userId);
		};
		
		// Añadir elemento de cuenta.
		div.appendChild(span);
	} else {
		div.classList.add('chat-system');
	}
	
	// Elemento de contenido,
	let text = document.createTextNode(message.content);
	
	// Añadir elemento de contenido.
	div.appendChild(text);
	
	joinRoomBox.querySelector('div.chat-messages').appendChild(div);
	
	// Hacer scroll hacia abajo del todo.
	joinRoomBox.querySelector('div.chat-messages').scrollTop = joinRoomBox.querySelector('div.chat-messages').scrollHeight;
}
