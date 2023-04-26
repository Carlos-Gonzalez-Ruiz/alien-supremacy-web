package com.carlosgonzalezruiz.aliensupremacyweb;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Alien Supremacy - Proyecto Fin de Ciclo
 * 
 * Clase principal de la aplicación Web.
 * 
 * @author Carlos González Ruiz - 2ºDAM
 */
@SpringBootApplication
public class AlienSupremacyWebApplication implements CommandLineRunner {

	/** Logger */
	private static final org.slf4j.Logger  log = org.slf4j.LoggerFactory.getLogger(AlienSupremacyWebApplication.class);

	/**
	 * Método principal de la clase.
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		SpringApplication.run(AlienSupremacyWebApplication.class, args);
	}

	/**
	 * Método que se ejecuta tras finalizar la inicialización de Spring.
	 * 
	 * @param args
	 */
	@Override
	public void run(String... args) {
		log.info("Application started...");
		log.warn("Web backend won't start game server anymore due to infrastructure changes.");
	}

}
