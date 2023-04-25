/**
  * Módulo para la sección de sala del menú del juego.
  */

import * as domUi from '/js/dom-ui/dom-ui.js';

import * as game from '/js/game/game.js';
import * as audio from '/js/game/audio.js';

import * as gameControl from '/js/game/game-control.js';
import * as gameControlUi from '/js/game/game-control-ui.js';

import * as gameMenuUi from '/js/game/game-menu-ui.js';
import * as gameMenuUiJoinRoom from '/js/game/game-menu-ui-joinroom.js';

import * as galaxy from '/js/game/scene/galaxy.js';

/** Lista de elementos. */
let elements = [];
/** Caja de sala. */
export let roomBox;
/** Caja para empezar la partida. */
let startGameBox;
/** Caja de entrar como espectador. */
let spectatorBox;
/** Caja para salir del modo espectador. */
let exitSpectatorBox;

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
	// Caja de sala.
	roomBox = domUi.createScrollableElement(`
		<div style="margin: 4em; width: 550px; /*height: calc(100vh - (4em * 2.5));*/">
			<div style="display: flex;">
				<div style="flex: 1; max-width: fit-content; margin: 1em">
					<button data-title="Exit room" class="game exit-room"><i class="bi bi-arrow-left"></i></button>
				</div>
				<div style="flex: 1;">
					<div class="box" style="margin-bottom: 1em; text-align: center;">
						<div class="box-title-simple">
							<h2><i class="bi bi-question-lg"></i> Test room</h2>
						</div>
					</div>
					<div class="box" style="margin-bottom: 1em; height: calc(50vh - 4em * 2.5); overflow: auto; text-align: center;">
						<h3>Game mode</h3>
						<p>Supremacy</p>
						<br>
						
						<h3>Galaxy</h3>
						<div style="display: flex;">
							<div style="flex: 1;">
								<h4>Galaxy name</h4>
								<p class="galaxy-name">Test</p>
							</div>
							<div style="flex: 1;">
								<h4>Galaxy Seed</h4>
								<p class="galaxy-seed">1234567890</p>
							</div>
						</div>
						
						<br>
						<button class="game regenerate-galaxy">Regenerate galaxy</button>
						<br>
					</div>
					<div style="display: flex; gap: 1em; height: calc(50vh - 4em * 2.5);">
						<div style="flex: 3;">
							<div class="box" style="height: 100%;">
								<div class="box-title">
									<i class="bi bi-chat-fill"></i>
									Room chat
								</div>
								<div class="chat-content" style="height: calc(100% - 6.5em);">
									<div class="box-content" style="height: 100%;">
										<!--
										<div><span class="chat-username">User 1234 →</span> This is a chat :)</div>
										<div><span class="chat-username">User 12345 →</span> Hi!!</div>
										-->
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
										<!--
										<tr>
											<td>SirVladem</td>
										</tr>
										-->
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`);
	roomBox.querySelector('button.exit-room').onclick = function() {
		gameMenuUiJoinRoom.displayJoinRoomBox('fadeInLeft');
		
		// Esconder elementos.
		hideStartGameBox();
		hideSpectatorBox();
		hideRoomBox();
		
		gameMenuUi.hideGalaxyNameBox();
		
		// Reproducir sonido.
		audio.soundClick2.play();
	};
	roomBox.querySelector('button.regenerate-galaxy').onclick = function() {
		galaxy.generateGalaxyAnimated(Math.random());
		
		// Reproducir sonido.
		audio.soundClick.play();
	}
	elements.push(roomBox);
	
	// Caja para empezar la partida.
	startGameBox = domUi.createElement(`
		<button data-title="Start game" class="start-game">Start game</button>
	`);
	startGameBox.onclick = function() {
		// Esconder elementos.
		hideStartGameBox();
		hideSpectatorBox();
		hideRoomBox();
		
		gameMenuUi.hideAccountBox();
		gameMenuUi.hideGalaxyNameBox();
		gameMenuUi.displayAccountBox();
		
		// Mostrar elementos de gameControl.
		gameControlUi.displayChatBox();
		
		// Terminar fase de menú.
		game.setMainMenu(false);
		game.setSpectatorMode(false);
		
		// Empezar juego.
		gameControl.startGame();
	}
	elements.push(startGameBox);
	
	// Caja de ver como espectador.
	spectatorBox = domUi.createElement(`
		<button data-title="Go spectator mode" class="game spectator-mode"><i class="bi bi-eye-fill"></i> Spectate</button>
	`);
	spectatorBox.onclick = function() {
		// Comprobar visibilidad.
		if (domUi.getVisibility(spectatorBox) && !domUi.getVisibility(exitSpectatorBox)) {
			// Mostrar elementos.
			displayExitSpectatorBox();
			
			// Mostrar elementos de gameControl.
			gameControlUi.displayChatBox();
			
			// Terminar fase de menú.
			game.setMainMenu(false);
			// Ponerse en modo espectador.
			game.setSpectatorMode(true);
			
			// Reproducir sonido.
			audio.soundGameStart2.play();
			
			hideStartGameBox();
			hideSpectatorBox();
			hideRoomBox();
			
			gameMenuUi.hideAccountBox();
		}
	}
	elements.push(spectatorBox);
	
	// Caja para salir del motod espectador.
	exitSpectatorBox = domUi.createElement(`
		<button data-title="Exit spectator mode" class="game"><i class="bi bi-door-open-fill"></i> Exit</button>
	`);
	exitSpectatorBox.onclick = function() {
		// Comprobar visibilidad.
		if (!domUi.getVisibility(spectatorBox) && domUi.getVisibility(this)) {
			// Mostrar elementos.
			displayStartGameBox();
			displaySpectatorBox();
			displayRoomBox();
			
			gameMenuUi.displayAccountBox();
			gameMenuUi.displayGalaxyNameBox();
			
			// Esconder elementos de gameControl.
			gameControlUi.hideChatBox();
			
			// Volver a fase de menú.
			game.setMainMenu(true);
			game.setSpectatorMode(false);
			
			// Esconder elementos.
			hideExitSpectatorBox();
		}
	}
	elements.push(startGameBox);
}

/**
  * Función de bucle del módulo.
  */
export function update() {

}

/**
  * Función para refactorizar el mostrar roomBox.
  */
export function displayRoomBox() {
	domUi.displayElement(roomBox, 'calc(100vw - 550px - (4em * 2.5))', 0 + 'px', 5);
	domUi.setAnimation(roomBox, 'fadeInRight', gameMenuUi.MENU_SECTION_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar roomBox.
  */
export function hideRoomBox() {
	let time = gameMenuUi.MENU_SECTION_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(roomBox, 'fadeOutRight', time + 's');
	// Esconder tras un tiempo.
	setTimeout(function() {
		domUi.hideElement(roomBox);
	}, time * 1000);
}

/**
  * Función para refactorizar el mostrar startGameBox.
  */
export function displayStartGameBox() {
	domUi.displayElement(startGameBox, 'calc(50vw - ' + domUi.getWidth(startGameBox) / 2 + 'px)', 'calc(100vh - 6.5em)', 10);
	domUi.setAnimation(startGameBox, 'fadeInUp', gameMenuUi.MENU_SECTION_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar startGameBox.
  */
export function hideStartGameBox() {
	let time = gameMenuUi.MENU_SECTION_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(startGameBox, 'fadeOutDown', time + 's');
	// Esconder tras un tiempo.
	setTimeout(function() {
		domUi.hideElement(startGameBox);
	}, time * 1000);
}

/**
  * Función para refactorizar el mostrar spectatorBox.
  */
export function displaySpectatorBox() {
	domUi.displayElement(spectatorBox, 2 + 'em', 'calc(100vh - 2em - ' + domUi.getHeight(spectatorBox) + 'px)', 5);
	domUi.setAnimation(spectatorBox, 'fadeInUp', gameMenuUi.MENU_SECTION_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar spectatorBox.
  */
export function hideSpectatorBox() {
	let time = gameMenuUi.MENU_SECTION_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(spectatorBox, 'fadeOutDown', time + 's');
	// Esconder tras un tiempo.
	setTimeout(function() {
		domUi.hideElement(spectatorBox);
	}, time * 1000);
}

/**
  * Función para refactorizar el mostrar exitSpectatorBox.
  */
export function displayExitSpectatorBox() {
	domUi.displayElement(exitSpectatorBox, 2 + 'em', 'calc(100vh - 2em - ' + domUi.getHeight(exitSpectatorBox) + 'px)', 5);
	domUi.setAnimation(exitSpectatorBox, 'fadeInUp', gameMenuUi.MENU_SECTION_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar exitSpectatorBox.
  */
export function hideExitSpectatorBox() {
	let time = gameMenuUi.MENU_SECTION_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(exitSpectatorBox, 'fadeOutDown', time + 's');
	// Esconder tras un tiempo.
	setTimeout(function() {
		domUi.hideElement(exitSpectatorBox);
	}, time * 1000);
}
