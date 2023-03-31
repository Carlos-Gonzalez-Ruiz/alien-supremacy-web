/**
  * Módulo de constantes de juego para guardar las distintas constantes.
  *
  * Los valores de nivel de vista corresponden al indice que tienen en el array de vistas en el módulo 'graphics'.
  */

/** Duración de cada frame para las físicas. */
export const TIME_STEP = 1 / 60;
/** Duración máxima que puede ocurrir en cada frame. */
export const MAX_SUBSTEPS = 5;

/** Nivel de vista de Universo. */
export const VIEW_LEVEL_UNIVERSE = 0;
/** Nivel de vista de galaxia. */
export const VIEW_LEVEL_GALAXY = 1;
/** Nivel de vista de sistema estelar. */
export const VIEW_LEVEL_STARSYSTEM = 2;
