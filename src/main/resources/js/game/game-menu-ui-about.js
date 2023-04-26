/**
  * Módulo para la sección de acerca del menú del juego.
  */

import * as domUi from '/js/dom-ui/dom-ui.js';

import * as game from '/js/game/game.js';
import * as audio from '/js/game/audio.js';

import * as gameMenuUi from '/js/game/game-menu-ui.js';

/** Lista de elementos. */
let elements = [];
/** Caja de acerca. */
let aboutBox;

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
	// Caja de acerca.
	aboutBox = domUi.createScrollableElement(`
		<div style="margin: 4em; width: calc(100vw - (4em * 2.5)); height: calc(100vh - (4em * 2.5));">
			<div style="display: flex;">
				<div style="flex: 1; max-width: fit-content; margin: 1em">
					<button data-title="Go back to the menu" class="game go-back"><i class="bi bi-arrow-left"></i></button>
				</div>
				<div style="flex: 1;">
					<div class="box" style="margin-bottom: 2em; text-align: center;">
						<div class="box-title-simple">
							<h2><i class="bi bi-question-lg"></i> About</h2>
						</div>
						<div class="box-description">
							<p>Alien Supremacy is an online RTS simple game where your objective is to gather resources by building colonies and build combat space ships to defeat the other alien empires.</p>
							<p>Achieve the alien supremacy in the galaxy!</p>
						</div>
					</div>
					<div class="box" style="max-height: calc(100vh - 4em * 2.5 - 2em - 10em); overflow: auto; text-align: center;">
						<div style="display: flex">
							<div style="flex: 1">
								<h3>Network & graphics programming</h3>
								<p>Carlos González</p>
								<br>
								
								<h3>Game design</h3>
								<p>Carlos González</p>
								<br>
								
								<h3>UI/UX Design</h3>
								<p>Carlos González</p>
								<br>
							</div>
							
							<div style="flex: 1">
								<h3>Music</h3>
								<p>
									Menu: <i><a href="https://www.newgrounds.com/audio/listen/991299">Cant Sleep anymore</a></i> - ImSoAlive <br>
									Game: <i><a href="https://www.newgrounds.com/audio/listen/382131">Right Through</a></i> - pyrotek45 <br>
								</p>
								<br>
								
								<h3>Sound effects</h3>
								<p>
									<i><a href="https://freesound.org/people/MATRIXXX_/sounds/658266/">slide</a></i> - MATRIXXX_ <br>
									<i><a href="https://freesound.org/people/MATRIXXX_/sounds/657948/">chat</a></i> - MATRIXXX_ <br>
									<i><a href="https://freesound.org/people/nezuai/sounds/582594/">click</a></i> - nezuai <br>
									<i><a href="https://freesound.org/people/Erokia/sounds/470208/">click2</a></i> - Erokia <br>
									<i><a href="https://freesound.org/people/Divoljud/sounds/520579/">hover</a></i> - Divoljud <br>
									<i><a href="https://freesound.org/people/TheAtomicBrain/sounds/351878/">game-start</a></i> - TheAtomicBrain <br>
									<i><a href="https://freesound.org/people/jalastram/sounds/361887/">game-start2</a></i> - jalastram <br>
								</p>
								<br>
							</div>
							
							<div style="flex: 1">
								<h3>Third party</h3>
								<p>
									Three.js</br>
									Howler.js</br>
									Spring Framework</br>
									Bootstrap icons</br>
									Animate.css</br>
								<br>
								
								<h3>Fonts</h3>
								<p>
									Ubuntu</br>
									Abel</br>
									Orbitron</br>
								</p>
								<br>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`);
	aboutBox.querySelector('button.go-back').onclick = function() {
		gameMenuUi.displayMainMenuBox();
		gameMenuUi.displayRefreshButtonBox();
		gameMenuUi.displayGalaxyNameBox();
		hideAboutBox();
		
		// Reproducir sonido.
		audio.soundClick2.play();
	};
	elements.push(aboutBox);
}

/**
  * Función de bucle del módulo.
  */
export function update() {

}

/**
  * Función para refactorizar el mostrar aboutBox.
  */
export function displayAboutBox() {
	domUi.displayElement(aboutBox, 0 + 'px', 0 + 'px', 5);
	domUi.setAnimation(aboutBox, 'fadeInRight', gameMenuUi.MENU_SECTION_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar aboutBox.
  */
export function hideAboutBox() {
	let time = gameMenuUi.MENU_SECTION_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(aboutBox, 'fadeOutRight', time + 's');
	// Esconder tras un tiempo.
	setTimeout(function() {
		domUi.hideElement(aboutBox);
	}, time * 1000);
}

