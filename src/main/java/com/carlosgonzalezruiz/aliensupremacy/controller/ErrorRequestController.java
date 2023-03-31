package com.carlosgonzalezruiz.aliensupremacy.controller;

import org.slf4j.Logger;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.carlosgonzalezruiz.aliensupremacy.constant.UrlConstants;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Alien Supremacy - Proyecto Fin de Ciclo
 * 
 * Controlador de peticiones de error que ocurran mientras el servidor Web esté
 * operativo.
 * 
 * @author Carlos González Ruiz - 2ºDAM
 */
@Controller
public class ErrorRequestController implements ErrorController {

	/** Logger */
	private static final Logger log = org.slf4j.LoggerFactory.getLogger(ErrorRequestController.class);

	/**
	 * Procesa las peticiones de error que ocurran.
	 * 
	 * A causa de la configuración, cualquier error de petición redigirá
	 * (forwarding) a la ruta definida en UrlConstants.ERROR_PATH.
	 * 
	 * @param httpRequest
	 * @return ModelAndView
	 */
	@RequestMapping(value = UrlConstants.ERROR_PATH)
	public ModelAndView renderErrorPage(HttpServletRequest httpRequest) {
		// Crear view del HTML.
		ModelAndView errorPage = new ModelAndView(UrlConstants.GENERIC_ERROR_HTML);

		String errorMsg = "";
		int httpErrorCode = getErrorCode(httpRequest);

		log.info("HTTP request error code: {}", httpErrorCode);

		switch (httpErrorCode) {
		case 400: {
			errorMsg = "Http Error Code: 400. Bad Request";
			break;
		}
		case 401: {
			errorMsg = "Http Error Code: 401. Unauthorized";
			break;
		}
		case 500: {
			errorMsg = "Http Error Code: 500. Internal Server Error";
			break;
		}
		default:
		case 404: {
			errorMsg = "Http Error Code: 404. Resource not found";
			break;
		}
		}

		// Pasar al HTML el mensaje de error.
		errorPage.addObject("errorMsg", errorMsg);

		return errorPage;
	}

	/**
	 * Método que devuelve el código de error de la petición HTTP. En caso de error,
	 * devolverá el código de error 200. (HTTP OK)
	 * 
	 * @param httpRequest
	 * @return int
	 */
	private int getErrorCode(HttpServletRequest httpRequest) {
		int code = 200;

		if (httpRequest != null) {
			Object status = httpRequest.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
			if (status != null) {
				code = Integer.valueOf(httpRequest.getAttribute(RequestDispatcher.ERROR_STATUS_CODE).toString());
			}
		}

		return code;
	}

}
