package com.carlosgonzalezruiz.aliensupremacy.game.server;

import com.carlosgonzalezruiz.aliensupremacy.constant.GameConstants;
import com.carlosgonzalezruiz.aliensupremacy.game.AbstractThread;
import com.carlosgonzalezruiz.aliensupremacy.game.client.ThreadClient;

/**
 * Alien Supremacy - Proyecto Fin de Ciclo
 * 
 * Hilo adicional al del servidor que comprueba la conectividad de los clientes,
 * desconectando, liberando y/o terminado los hilos de aquellos clientes que
 * sobrepasado el tiempo de espera.
 * 
 * @author Carlos González Ruiz - 2ºDAM
 */
public class ThreadServerListener extends AbstractThread {

	/** Logger */
	public static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ThreadServerListener.class);

	/** Hilo del servidor. */
	ThreadServer server;

	/**
	 * Método constructor de la clase.
	 * 
	 * @param server
	 */
	public ThreadServerListener(ThreadServer server) {
		super();

		this.server = server;
	}

	/**
	 * Método run del hilo, en dónde se comprobará que el cliente
	 */
	@Override
	public void run() {
		while (server.getRunning()) {
			for (ThreadClient c : server.getClients()) {
				// Eliminar hilos cliente fantasma (connected = false)
				if (!c.getConnected()) {
					try {
						c.join();
						server.getClients().remove(c);
						
						log.info("Eliminated ghost client thread.");
					} catch (InterruptedException e) {
						Thread.currentThread().interrupt();
						e.printStackTrace();
					}
				}
			}
			
			sleepThread(GameConstants.SERVER_TICK_RATE);
		}
	}

}
