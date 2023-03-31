package com.carlosgonzalezruiz.aliensupremacy;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.carlosgonzalezruiz.aliensupremacy.game.server.ThreadServer;
import com.carlosgonzalezruiz.aliensupremacy.game.server.ThreadServerListener;

/**
 * Alien Supremacy - Proyecto Fin de Ciclo
 * 
 * Clase principal de la aplicación.
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

		// Iniciar servidor.
		ThreadServer threadServer = new ThreadServer();
		ThreadServerListener threadServerListener = new ThreadServerListener(threadServer);
		threadServer.start();
		threadServerListener.start();

		// Esperar a que termine el servidor.
		try {
			threadServerListener.join();
			threadServer.join();
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			log.error("Failed to join the thread: {}", e.getMessage());
		}
	}

}
