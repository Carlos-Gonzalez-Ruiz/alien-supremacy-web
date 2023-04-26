package com.carlosgonzalezruiz.aliensupremacyweb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.carlosgonzalezruiz.aliensupremacyweb.constant.UrlConstants;

/**
 * Alien Supremacy - Proyecto Fin de Ciclo
 * 
 * Controlador de peticiones de la ruta Home (/)
 * 
 * @author Carlos González Ruiz - 2ºDAM
 */
@Controller
@RequestMapping(UrlConstants.HOME_CONTROLLER_PATH)
public class HomeController {

	/**
	 * Redirecciona cualquier peticición index.html a index.html
	 * 
	 * @return String
	 */
	@RequestMapping(UrlConstants.INDEX_HTML)
	public String indexHTML() {
		return UrlConstants.INDEX_HTML;
	}
	
	/**
	 * Ruta juego de navegador Alien Supremacy.
	 * 
	 * @return String
	 */
	@RequestMapping(UrlConstants.HOME_CONTROLLER_PATH_GAME)
	public String game() {
		return UrlConstants.INDEX_HTML;
	}

}