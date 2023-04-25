/**
  * Módulo para la gestión de sonido.
  */

/** Sonido: slide. */
export let soundSlide;
/** Sonido: click. */
export let soundClick;
/** Sonido: click2. */
export let soundClick2;
/** Sonido: chat. */
export let soundChat;
/** Sonido: hover. */
export let soundHover;
/** Sonido: game-start. */
export let soundGameStart;
/** Sonido: game-start2. */
export let soundGameStart2;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Slide.
	soundSlide = new Howl({
		src: [ '/audio/sound/658266-slide.wav' ],
		volume: 1
	});
	// Click.
	soundClick = new Howl({
		src: [ '/audio/sound/582594-click.wav' ],
		volume: 1
	});
	// Click 2.
	soundClick2 = new Howl({
		src: [ '/audio/sound/470208-click2.wav' ],
		volume: 0.25
	});
	// Chat.
	soundChat = new Howl({
		src: [ '/audio/sound/657948-chat.wav' ],
		volume: 1
	});
	// Hover.
	soundHover = new Howl({
		src: [ '/audio/sound/520579-hover.wav' ],
		volume: 1
	});
	// Game Start.
	soundGameStart = new Howl({
		src: [ '/audio/sound/351878-game-start.wav' ],
		volume: 1
	});
	// Game Start 2.
	soundGameStart2 = new Howl({
		src: [ '/audio/sound/361887-game-start2.wav' ],
		volume: 0.1
	});
}

/**
  * Función de bucle del módulo.
  */
export function update() {

}
