/**
  * Módulo para la sección de unirse a sala del menú del juego.
  */

import * as domUi from '/js/dom-ui/dom-ui.js';

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
										Showing 123 rooms.
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
										<tr>
											<td style="color: red;"><i class="bi bi-person-x-fill"></i></td>
											<td>First room ever</td>
											<td>Supremacy</td>
											<td><div style="text-align: center;">2 / 8</div></td>
										</tr>
										<tr>
											<td style="color: white;"><i class="bi bi-person-check-fill"></i></td>
											<td>No nigger room</td>
											<td>KOH</td>
											<td><div style="text-align: center;">4 / 6</div></td>
										</tr>
										<tr>
											<td style="color: white;"><i class="bi bi-person-check-fill"></i></td>
											<td>No nigger room</td>
											<td>KOH</td>
											<td><div style="text-align: center;">4 / 6</div></td>
										</tr>
										<tr>
											<td style="color: white;"><i class="bi bi-person-check-fill"></i></td>
											<td>No nigger room</td>
											<td>KOH</td>
											<td><div style="text-align: center;">4 / 6</div></td>
										</tr>
										<tr>
											<td style="color: white;"><i class="bi bi-person-check-fill"></i></td>
											<td>No nigger room</td>
											<td>KOH</td>
											<td><div style="text-align: center;">4 / 6</div></td>
										</tr>
										<tr>
											<td style="color: white;"><i class="bi bi-person-check-fill"></i></td>
											<td>No nigger room</td>
											<td>KOH</td>
											<td><div style="text-align: center;">4 / 6</div></td>
										</tr>
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
									<div class="box-content" style="height: 100%;">
										<div><span class="chat-username">User 1234 →</span> This is a chat :)</div>
										<div><span class="chat-username">User 12345 →</span> Hi!!</div>
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
								</div>
								<div class="box-content" style="height: calc(100% - 3em);">
									<table class="users">
										<tr>
											<td>SirVladem</td>
										</tr>
										<tr>
											<td>Ridem</td>
										</tr>
										<tr>
											<td>CarlosGonz</td>
										</tr>
										<tr>
											<td>0x2A</td>
										</tr>
										<tr>
											<td>Overcast</td>
										</tr>
										<tr>
											<td>king_user</td>
										</tr>
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
	};
	joinRoomBox.querySelector('button.create-room').onclick = function() {
		gameMenuUiRoom.displayRoomBox();
		gameMenuUiRoom.displayStartGameBox();
		gameMenuUiRoom.displaySpectatorBox();
		
		gameMenuUi.displayGalaxyNameBox();
		
		hideJoinRoomBox('fadeOutLeft');
		
		// Adicionalmente, regenerar galaxia.
		galaxy.generateGalaxyAnimated(Math.random());
		
		// Reproducir sonido.
		audio.soundClick.play();
	};
	elements.push(joinRoomBox);
}

/**
  * Función de bucle del módulo.
  */
export function update() {

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
	// Esconder tras un tiempo.
	setTimeout(function() {
		domUi.hideElement(joinRoomBox);
	}, time * 1000);
}
