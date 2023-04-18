/**
  * Módulo de interfaz de usuario DOM de control de juego.
  */

import * as domUi from '/js/dom-ui/dom-ui.js';

import * as graphics from '/js/graphics/graphics.js';
import * as keyboard from '/js/keyboard/keyboard.js';

import * as gameControl from '/js/game/game-control.js';

/** Lista de elementos. */
let elements = [];
/** Caja de selección. */
let selectBox;
/** Caja de chat. */
let chatBox;

/** Indicar si se debe mostrar la UI. */
let displayUi = false;

/** Música de fondo (BGM) */
export let backgroundMusic;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	initDomUi();
	
	// Cargar sonido.
	backgroundMusic = new Howl({
		src: [ '/audio/bgm/382131-Right-Through.mp3' ],
		autoplay: false,
		loop: true,
		volume: 0.05
	});
}

/**
  * Función de inicialización de domUi.
  */
function initDomUi() {
	// Caja de chat.
	chatBox = domUi.createScrollableElement(`
		<div class="box"
		 style="
			min-width: 500px;
			max-width: 500px;
			
			box-sizing: border-box;
		">
			<div class="box-title">
				<span class="icon">🗨</span>
				Room chat <span class="chat-new-messages">(5)</span>
				<button class="game chat-hide" style="float: right;">▾</button>
			</div>
			<div class="chat-content"
			 style="
				min-height: 180px;
				max-height: 180px;
			">
				<div class="box-content"
				 style="
					min-height: 135px;
					max-height: 135px;
				">
					<div><span class="chat-username">User 1234 →</span> This is a chat :)</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
					<div><span class="chat-username">User 12345 →</span> Hi!!</div>
				</div>
				<div style="display: flex; align-items: center; gap: 15px;">
					<div style="flex: 100%;">
						<input style="width: 100%;" type="text" class="box-content chat-send-message" placeholder="...">
					</div>
					<div style="flex: 1;">
						<button class="game chat-send-message">Send</button>
					</div>
				</div>
			</div>
		</div>
	`);
	chatBox.querySelector('button.chat-hide').dataset.hidden = false;
	chatBox.querySelector('button.chat-hide').onclick = function() {
		this.dataset.hidden = this.dataset.hidden == 'true' ? false : true;
		
		if (this.dataset.hidden == 'true') {
			this.textContent = '◂';
			chatBox.querySelector('div.chat-content').style.display = 'none';
		} else {
			this.textContent = '▾';
			chatBox.querySelector('div.chat-content').style.display = 'block';
		}
	};
	chatBox.querySelector('button.chat-send-message').onclick = function() {
		console.log('send message');
		
		// Vaciar caja de texto.
		chatBox.querySelector('input[type="text"].chat-send-message').value = "";
	};
	chatBox.querySelector('input[type="text"].chat-send-message').onkeydown = function(e) {
		// Enviar mensaje al pulsar 'Enter'.
		if (e.key == 'Enter') {
			console.log('send message');
			
			this.value = '';
		}
	};
	elements.push(chatBox);
	
	// Caja de selección de tropa.
	selectBox = domUi.createScrollableElement(`
		<div class="unit-select-box">
		</div>
	`);
	elements.push(selectBox);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	
}

/**
  * Función para refactorizar el mostrar chatBox.
  */
export function displayChatBox() {
	domUi.displayElement(chatBox, (graphics.canvas.width - domUi.getWidth(chatBox)) + 'px', 0 + 'px', 20);
}

/**
  * Función para refactorizar el dejar de mostrar chatBox.
  */
export function hideChatBox() {
	domUi.hideElement(chatBox);
}

/**
  * Función para refactorizar el mostrar selectBox.
  */
export function displaySelectBox() {
	let selectPosX = gameControl.selectPosX;
	let selectPosY = gameControl.selectPosY;
	let selectWidth = keyboard.cursorPosX - gameControl.selectPosX;
	let selectHeight = keyboard.cursorPosY - gameControl.selectPosY;
	
	// Comprobar si es negativo.
	if (selectWidth < 0) {
		selectWidth = Math.abs(selectWidth);
		selectPosX = gameControl.selectPosX - selectWidth;
	}
	
	if (selectHeight < 0) {
		selectHeight = Math.abs(selectHeight);
		selectPosY = gameControl.selectPosY - selectHeight;
	}
	
	// Mostrar caja.
	if (selectWidth > 5 && selectHeight > 5) {
		domUi.displayElement(selectBox, selectPosX + 'px', selectPosY + 'px', 5);
		selectBox.querySelector('div.unit-select-box').style.minWidth = selectWidth + 'px';
		selectBox.querySelector('div.unit-select-box').style.minHeight = selectHeight + 'px';
		
		// Indicar que ocurre selección.
		gameControl.setSelecting(true);
	}
}

/**
  * Función para refactorizar el dejar de mostrar selectBox.
  */
export function hideSelectBox() {
	domUi.hideElement(selectBox);
	
	// Dejar de seleccionar.
	gameControl.setSelecting(false);
}

/**
  * Callback de actualización cuando la cámara sea actualizada.
  */
export function cameraOnUpdate() {
	// Solo actualizar si se ha de mostrar la UI.
	if (displayUi) {
		// ...
	}
}
