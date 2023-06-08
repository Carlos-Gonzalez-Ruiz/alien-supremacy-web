/**
  * Módulo para el menú del juego.
  */

import * as main from '/js/main.js';

import * as domUi from '/js/dom-ui/dom-ui.js';

import * as keyboard from '/js/keyboard/keyboard.js';

import * as game from '/js/game/game.js';
import * as audio from '/js/game/audio.js';

import * as gameMenuUiJoinRoom from '/js/game/game-menu-ui-joinroom.js';
import * as gameMenuUiPlayerSettings from '/js/game/game-menu-ui-playersettings.js';
import * as gameMenuUiVisualSettings from '/js/game/game-menu-ui-visualsettings.js';
import * as gameMenuUiAbout from '/js/game/game-menu-ui-about.js';
import * as gameMenuUiRoom from '/js/game/game-menu-ui-room.js';

import * as galaxy from '/js/game/scene/galaxy.js';

/** Lista de elementos. */
let elements = [];
/** Caja de menú principal. */
let mainMenuBox;
/** Caja de actualizar galaxia. */
let refreshButtonBox;
/** Caja de nombre de galaxia. */
export let galaxyNameBox;
/** Caja de cuenta actual. */
export let accountBox;
/** Caja de visualizar cuenta. */
let viewAccountBox;
/** Caja transparente que bloquea toda la pantalla. */
let transparentBox;
/** Caja negra que bloquea toda la pantalla. */
let blackBox;
/** Caja de pedir datos de usuario. */
let logInBox;
/** Caja de cargando. */
let loadingBox;
/** Caja popup de mensaje. */
let popupBox;

/** Indicar si se debe mostrar la UI. */
let displayUi = false;

/** Indicar si ha iniciado sesión. */
let accountLogged = false;
/** Indicar si se está visualizando una cuenta. */
let viewingAccount = false;

/** Tiempo que tarda la animación de mostrar menú en segundos. */
const MAIN_MENU_ANIMATION_TIME_START = 0.5;
/** Tiempo que tarda la animación de esconder menú en segundos. */
const MAIN_MENU_ANIMATION_TIME_END = 0.5;
/** Tiempo que tarda la animación de mostrar una sección del menú en segundos. */
export const MENU_SECTION_ANIMATION_TIME_START = 0.5;
/** Tiempo que tarda la animación de esconder una sección del menú en segundos. */
export const MENU_SECTION_ANIMATION_TIME_END = 0.5;

/** Música de fondo (BGM) */
export let backgroundMusic;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	initDomUi();
	
	// Inicializar sub componentes.
	gameMenuUiJoinRoom.init();
	gameMenuUiPlayerSettings.init();
	gameMenuUiVisualSettings.init();
	gameMenuUiAbout.init();
	gameMenuUiRoom.init();
	
	// Empezar mostrando menú.
	displayMainMenuBox();
	displayRefreshButtonBox();
	displayGalaxyNameBox();
	displayAccountBox();
	
	// Adicionalmente, preguntar por nombre de usuario.
	displayBlackBox(false);
	displayLoadingBox();
	displayLogInBox();
	
	// Cargar sonido.
	backgroundMusic = new Howl({
		src: [ '/audio/bgm/991299-Cant-Sleep-Anymore-Edit.mp3' ],
		autoplay: false,
		loop: true,
		volume: 0.5
	});
}

/**
  * Función de inicialización de domUi.
  */
function initDomUi() {
	// Caja de menú princpal
	mainMenuBox = domUi.createScrollableElement(`
		<div class="main-menu">
			<h1 class="main-menu unselectable">Alien Supremacy</h1>
			<button class="main-menu join-room" data-title="Join a room and play multiplayer"><i class="bi bi-people-fill"></i> Join rooms</button>
			<button class="main-menu player-settings" data-title="Change player settings"><i class="bi bi-gear-fill"></i> Player settings</button>
			<button class="main-menu visual-settings" data-title="Change visual settings"><i class="bi bi-gear-fill"></i> Visuals settings</button>
			<button class="main-menu about" data-title="Information about the game"><i class="bi bi-question-lg"></i> About</button>
		</div>
	`);
	mainMenuBox.querySelector('button.join-room').onclick = function() {
		hideMainMenuBox();
		hideRefreshButtonBox();
		hideGalaxyNameBox();
		
		gameMenuUiJoinRoom.displayJoinRoomBox();
		
		// Reproducir sonido.
		audio.soundClick.play();
		
		// Establecer conexión con el servidor principal.
		gameMenuUiJoinRoom.startWebsocket();
	};
	mainMenuBox.querySelector('button.join-room').onmouseenter = function () {
		audio.soundHover.play();
	};
	
	mainMenuBox.querySelector('button.player-settings').onclick = function() {
		hideMainMenuBox();
		hideRefreshButtonBox();
		hideGalaxyNameBox();
		
		gameMenuUiPlayerSettings.displayPlayerSettingsBox();
		
		// Reproducir sonido.
		audio.soundClick.play();
	};
	mainMenuBox.querySelector('button.player-settings').onmouseenter = function () {
		audio.soundHover.play();
	};
	
	mainMenuBox.querySelector('button.visual-settings').onclick = function() {
		hideMainMenuBox();
		hideRefreshButtonBox();
		hideGalaxyNameBox();
		
		gameMenuUiVisualSettings.displayVisualSettingsBox();
		
		// Reproducir sonido.
		audio.soundClick.play();
	};
	mainMenuBox.querySelector('button.visual-settings').onmouseenter = function () {
		audio.soundHover.play();
	};
	
	mainMenuBox.querySelector('button.about').onclick = function() {
		hideMainMenuBox();
		hideRefreshButtonBox();
		hideGalaxyNameBox();
		
		gameMenuUiAbout.displayAboutBox();
		
		// Reproducir sonido.
		audio.soundClick.play();
	};
	mainMenuBox.querySelector('button.about').onmouseenter = function () {
		audio.soundHover.play();
	};
	
	elements.push(mainMenuBox);
	
	// Caja de actualizar galaxia.
	refreshButtonBox = domUi.createElement(`
		<button data-title="Update Galaxy" class="game refresh"><i class="bi bi-arrow-clockwise"></i></button>
	`);
	refreshButtonBox.querySelector('button.refresh').onclick = function() {
		galaxy.generateGalaxyAnimated(Math.random());
		
		// Reproducir sonido.
		audio.soundClick.play();
	};
	elements.push(refreshButtonBox);
	
	// Caja de nombre de galaxia.
	galaxyNameBox = domUi.createElement(`
		<div style="color: #AAA; text-align: center;">
			Galaxy: <span class="name" style="color: #FFF">Galaxy name</span>
			<br>
			Seed: <span class="seed" style="color: #FFF">Galaxy name</span>
		</div>
	`);
	elements.push(galaxyNameBox);
	
	// Caja de cuenta actual.
	accountBox = domUi.createElement(`
		<div class="box-account">
			<i class="bi bi-person-circle"></i> <span class="name"></span>
		</div>
	`);
	accountBox.querySelector('div.box-account').onclick = function() {
		viewAccount(accountBox.querySelector('span.name').textContent, -1);
	};
	elements.push(accountBox);
	
	// Caja de visualizar cuenta.
	viewAccountBox = domUi.createScrollableElement(`
		<div class="box" style="width: 200px;">
			<div style="display: flex; align-items: center;">
				<div style="flex: 0;">
					<button data-title="Close" class="game close"><i class="bi bi-x-lg"></i></i></button>
				</div>
				<div style="flex: fit-content;">
					<h2 class="name" style="margin: unset; text-align: center;">Guest</h2>
				</div>
			</div>
			<p style="text-align: center;">This user is playing as guest.</p>
		</div>
	`);
	viewAccountBox.querySelector('button.close').onclick = function() {
		closeViewAccount();
	};
	elements.push(viewAccountBox);
	
	// Caja negra que ocupa toda la pantalla.
	transparentBox = domUi.createScrollableElement(`
		<div style="width: 100vw; height: 100vh; background-color: #000A; backdrop-filter: blur(10px);">
		</div>
	`);
	transparentBox.onclick = function() {
		if (viewingAccount) {
			closeViewAccount();
		} else { // En caso contrario, hacer lo equivalente a presionar el botón de cerrar pop-up.
			popupBox.querySelector('button.close').click();
		}
	};
	elements.push(transparentBox);
	
	// Caja negra que ocupa toda la pantalla.
	blackBox = domUi.createScrollableElement(`
		<div style="width: 100vw; height: 100vh; background-color: #000F">
		</div>
	`);
	elements.push(blackBox);
	
	// Caja de pedir datos de usuario.
	logInBox = domUi.createScrollableElement(`
		<div class="box" style="width: 400px; text-align: center;">
			<h2 class="name" style="margin: unset;">Enter user credentials</h2>
			<p>Before playing, you must log in.</p>
			<input style="width: calc(100% - 10px * 2); margin-bottom: 1em;" type="text" class="box-content username" placeholder="Guest" value="Guest">
			<p style="color: red; display: none;" class="error">Not a valid name.</p>
			<br>
			<button class="game log-in">Log in</button>
		</div>
	`);
	logInBox.querySelector('button.log-in').onclick = function() {
		let newUsername = logInBox.querySelector('input.username').value;
		
		// Validar datos de entrada localmente. (Se recomienda migrar al servidor más tarde)
		if (!!newUsername) {
			accountLogged = true;
			let newUser = {
				userId: -1,
				username: newUsername
			};
			game.setUser(newUser);
			
			// Esconder elementos.
			hideLogInBox();
			
			// Sonar música de fondo.
			backgroundMusic.play();
		} else {
			// Mostrar error.
			logInBox.querySelector('input.username').style.border = '1px solid red';
			logInBox.querySelector('p.error').style.display = 'block';
		}
	};
	elements.push(logInBox);
	
	// Caja de cargando.
	loadingBox = domUi.createScrollableElement(`
		<h3 style="color: #AAA; text-align: center; width: 100vw;">LOADING ...</h3>
	`);
	elements.push(loadingBox);
	
	// Caja de popup.
	popupBox = domUi.createScrollableElement(`
		<div class="box" style="width: 300px;">
			<div style="display: flex; align-items: center;">
				<div style="flex: 0;">
					<button data-title="Close" class="game close"><i class="bi bi-x-lg"></i></i></button>
				</div>
				<div style="flex: fit-content;">
					<h2 class="title" style="margin: unset; text-align: center;"></h2>
				</div>
			</div>
			<p class="content" style="text-align: center;"></p>
			<div style="text-align: center;">
				<button data-title="Close" class="game ok">OK</button>
			</div>
		</div>
	`);
	elements.push(popupBox);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	// Esconder todo finalmente tras cargar e iniciar sesión.
	if (main.loaded && accountLogged) {
		hideBlackBox();
	}
	
	gameMenuUiJoinRoom.update();
	gameMenuUiPlayerSettings.update();
	gameMenuUiVisualSettings.update();
	gameMenuUiAbout.update();
	gameMenuUiRoom.update();
	
	// Ejecutar hacer click en el transparent box si se presiona enter cuando transparent box es visible.
	if (domUi.getVisibility(transparentBox)) {
		if (keyboard.checkPressedOnce('Enter')) {
			transparentBox.click();
		}
	}
}

/**
  * Función para mostrar cierta información de la cuenta de un usuario.
  *
  * @param name el nombre de la cuenta.
  * @param uid el id del usuario. Usar -1 o 'undefined' si es invitado.
  */
export function viewAccount(name, uid) {
	// Mostrar / esconder cajas.
	displayViewAccountBox(name);
	displayTransparentBox();
	hideAccountBox();
	
	// Indicar que se está viendo una cuenta.
	viewingAccount = true;
	
	// Reproducir sonido.
	audio.soundClick2.play()
}

/**
  * Función para dejar mostrar cierta información de la cuenta de un usuario.
  */
export function closeViewAccount() {
	// Mostrar esconder cajas.
	displayAccountBox();
	hideViewAccountBox();
	hideTransparentBox();
	
	// Indicar que se deja de ver una cuenta.
	viewingAccount = false;
}

/**
  * Función para refactorizar el mostrar mainMenuBox.
  */
export function displayMainMenuBox() {
	domUi.displayElement(mainMenuBox, -32 + 'px', 0 + 'px)', 5);
	domUi.setAnimation(mainMenuBox, 'fadeInLeft', MAIN_MENU_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar mainMenuBox.
  */
export function hideMainMenuBox() {
	let time = MAIN_MENU_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(mainMenuBox, 'fadeOutLeft', time + 's');
	domUi.hideElement(mainMenuBox, time); // Esconder tras un tiempo.
}

/**
  * Función para refactorizar el mostrar refreshButtonBox.
  */
export function displayRefreshButtonBox() {
	domUi.displayElement(refreshButtonBox, '32px', 'calc(100vh - 48px)', 5);
	domUi.setAnimation(refreshButtonBox, 'fadeInLeft', MAIN_MENU_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar refreshButtonBox.
  */
export function hideRefreshButtonBox() {
	let time = MAIN_MENU_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(refreshButtonBox, 'fadeOutLeft', time + 's');
	domUi.hideElement(refreshButtonBox, time); // Esconder tras un tiempo.
}

/**
  * Función para refactorizar el mostrar galaxyNameBox.
  */
export function displayGalaxyNameBox() {
	domUi.displayElement(galaxyNameBox, 'calc(50vw - ' + domUi.getWidth(galaxyNameBox) / 2 + 'px)', 'calc(100vh - 48px)', 5);
	domUi.setAnimation(galaxyNameBox, 'fadeInUp', MAIN_MENU_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar galaxyNameBox.
  */
export function hideGalaxyNameBox() {
	let time = MAIN_MENU_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(galaxyNameBox, 'fadeOutDown', time + 's');
	domUi.hideElement(galaxyNameBox, time);
}

/**
  * Función para refactorizar el mostrar accountBox.
  */
export function displayAccountBox() {
	domUi.displayElement(accountBox, 'calc(95vw - ' + domUi.getWidth(accountBox) + 'px)', 0 + 'px', 100);
}

/**
  * Función para refactorizar el dejar de mostrar accountBox.
  */
export function hideAccountBox() {
	domUi.hideElement(accountBox);
}

/**
  * Función para refactorizar el mostrar viewAccountBox.
  *
  * @param name el nombre del usuario.
  */
export function displayViewAccountBox(name) {
	viewAccountBox.querySelector('h2.name').textContent = name;
	
	domUi.displayElement(
		viewAccountBox,
		'calc(50vw - ' + domUi.getWidth(viewAccountBox) / 2 + 'px)',
		'calc(50vh - ' + domUi.getHeight(viewAccountBox) / 2 + 'px)',
		200
	);
	domUi.setAnimation(viewAccountBox, 'fadeInDown', '0.25s');
}

/**
  * Función para refactorizar el dejar de mostrar viewAccountBox.
  */
export function hideViewAccountBox() {
	let time = '0.25'; // Tiempo en segundos.
	
	domUi.setAnimation(viewAccountBox, 'fadeOutUp', time + 's');
	domUi.hideElement(viewAccountBox, time); // Esconder tras un tiempo.
}

/**
  * Función para refactorizar el mostrar transparentBox.
  */
export function displayTransparentBox() {
	domUi.displayElement(transparentBox, 0 + 'px', 0 + 'px', 150);
	domUi.setAnimation(transparentBox, 'fadeIn', '0.25s');
}

/**
  * Función para refactorizar el dejar de mostrar transparentBox.
  */
export function hideTransparentBox() {
	let time = '0.25'; // Tiempo en segundos.
	
	domUi.setAnimation(transparentBox, 'fadeOut', time + 's');
	domUi.hideElement(transparentBox, time); // Esconder tras un tiempo.
}

/**
  * Función para refactorizar el mostrar blackBox.
  * 
  * @param animate indicar si realizar animación.
  */
export function displayBlackBox(animate) {
	domUi.displayElement(blackBox, 0 + 'px', 0 + 'px', 150);
	
	// Solo realizar animación si así se indica.
	if (animate || typeof animate === 'undefined') {
		domUi.setAnimation(blackBox, 'fadeIn', '0.25s');
	}
}

/**
  * Función para refactorizar el dejar de mostrar blackBox.
  */
export function hideBlackBox() {
	let time = '0.25'; // Tiempo en segundos.
	
	domUi.setAnimation(blackBox, 'fadeOut', time + 's');
	domUi.hideElement(blackBox, time); // Esconder tras un tiempo.
}

/**
  * Función para refactorizar el mostrar logInBox.
  */
export function displayLogInBox() {
	domUi.displayElement(
		logInBox,
		'calc(50vw - ' + domUi.getWidth(logInBox) / 2 + 'px)',
		'calc(50vh - ' + domUi.getHeight(logInBox) / 2 + 'px)',
		200
	);
	domUi.setAnimation(logInBox, 'fadeInDown', '0.25s');
}

/**
  * Función para refactorizar el dejar de mostrar logInBox.
  */
export function hideLogInBox() {
	let time = '0.25'; // Tiempo en segundos.
	
	domUi.setAnimation(logInBox, 'fadeOutUp', time + 's');
	domUi.hideElement(logInBox, time); // Esconder tras un tiempo.
}

/**
  * Función para refactorizar el mostrar loadingBox.
  */
export function displayLoadingBox() {
	domUi.displayElement(loadingBox, '0px', 'calc(70vh)', 200);
	domUi.setAnimation(loadingBox, 'fadeIn', '0.25s');
}

/**
  * Función para refactorizar el dejar de mostrar loadingBox.
  */
export function hideLoadingBox() {
	let time = '0.25'; // Tiempo en segundos.
	
	domUi.setAnimation(loadingBox, 'fadeOut', time + 's');
	domUi.hideElement(loadingBox, time); // Esconder tras un tiempo.
}

/**
  * Función para refactorizar el mostrar popupBox.
  *
  * @param title el título del mensaje.
  * @param content el contenido del mensaje.
  * @param onClose función anómima que se ejecuta tras cerrar el pop-up.
  */
export function displayPopupBox(title, content, onClose) {
	displayTransparentBox();

	// Establecer contenido.
	popupBox.querySelector('h2.title').textContent = title;
	popupBox.querySelector('p.content').textContent = content;
	popupBox.querySelector('button.close').onclick = popupBox.querySelector('button.ok').onclick = function() {
		onClose();
		hidePopupBox();
	};
	
	// Mostrar contenido.
	domUi.displayElement(
		popupBox,
		'calc(50vw - ' + domUi.getWidth(popupBox) / 2 + 'px)',
		'calc(50vh - ' + domUi.getHeight(popupBox) / 2 + 'px)',
		200
	);
	domUi.setAnimation(popupBox, 'fadeIn', '0.25s');
	
	// Reproducir sonido.
	audio.soundClick2.play()
}

/**
  * Función para refactorizar el dejar de mostrar popupBox.
  */
export function hidePopupBox() {
	hideTransparentBox();
	
	let time = '0.25'; // Tiempo en segundos.
	
	domUi.setAnimation(popupBox, 'fadeOut', time + 's');
	domUi.hideElement(popupBox, time); // Esconder tras un tiempo.
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

/**
  * Función para ir al menú. TODO
  */
export function goToMenu() {
	displayMainMenuBox();
	displayRefreshButtonBox();
	displayGalaxyNameBox();
	
	gameMenuUiJoinRoom.hideJoinRoomBox();
	
	// Reproducir sonido.
	audio.soundClick2.play();
}
