package com.carlosgonzalezruiz.aliensupremacy.game.client;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.security.NoSuchAlgorithmException;
import java.util.Scanner;

import com.carlosgonzalezruiz.aliensupremacy.constant.GameConstants;
import com.carlosgonzalezruiz.aliensupremacy.game.AbstractThread;
import com.carlosgonzalezruiz.aliensupremacy.game.server.ThreadServer;
import com.carlosgonzalezruiz.aliensupremacy.networking.WebSocketUtils;

/**
 * Alien Supremacy - Proyecto Fin de Ciclo
 * 
 * Hilo cliente que se dedicará a trabajar el lado de servidor de cada cliente
 * por cada hilo.
 * 
 * @author Carlos González Ruiz - 2ºDAM
 */
public class ThreadClient extends AbstractThread {

	/** Logger */
	private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ThreadClient.class);

	/** Hilo servidor. (Hilo padre) */
	@SuppressWarnings("unused")
	private ThreadServer threadServer;

	/** Socket del cliente. */
	private Socket client;
	/** Objeto de entrada de información. */
	private InputStream in;
	/** Objeto de salida de información. */
	private OutputStream out;

	/** Indicar si está conectado o no. */
	private boolean connected;

	/**
	 * Método constructor de la clase.
	 * 
	 * @param server
	 * @param client
	 * @throws IOException
	 */
	public ThreadClient(ThreadServer server, Socket client) throws IOException {
		super();

		this.threadServer = server;
		this.client = client;
		this.in = client.getInputStream();
		this.out = client.getOutputStream();

		this.connected = true;
	}

	/**
	 * Método run del hilo. Realizará el Handshake entre sockets en primer lugar, y
	 * luego procesará los mensajes hasta que connected = false.
	 */
	@Override
	public void run() {
		Scanner s = null;
		try {
			// Realizar handshake.
			s = WebSocketUtils.sendHandshake(in, out);

			log.info("Handsake sent to new client.");
			log.info("User {} has joined to the server.", client.getInetAddress());

			// Hacer ping inicial para comenzar con el PING/PONG.
			WebSocketUtils.sendPing(out);

			// Ejecutar buble principal de cliente-
			update();
		} catch (NoSuchAlgorithmException | IOException e) {
			log.error("An error has ocurred while doing the server-client handshake: {}", e.getMessage());
		} finally {
			if (s != null) {
				s.close();
			}
		}

		// Cerrar conexión de los clientes.
		try {
			client.close();
		} catch (IOException e) {
			log.error("An error has ocurred while closing client connection: {}", e.getMessage());
		}

		log.info("A client has just disconnected from the server.");
	}

	/**
	 * Método que realiza el procesamiento de mensajería, siempre y cuando connected
	 * = true.
	 * 
	 * @throws IOException
	 */
	private void update() throws IOException {
		while (connected) {
			// Recibir código de mensaje.
			int code = in.read();
			processMessaging((byte) code, in, out);

			sleepThread(GameConstants.SERVER_TICK_RATE);
		}
	}

	/**
	 * Método que procesa el código de mensaje.
	 * 
	 * @param code
	 * @param in
	 * @param out
	 * @throws IOException
	 */
	public void processMessaging(byte code, InputStream in, OutputStream out) throws IOException {
		switch (code) {

		case GameConstants.CODE_TEXT:
			WebSocketUtils.sendMessage(out, WebSocketUtils.getMessage(in));
			break;

		case GameConstants.CODE_PONG: {// Enviar PING.
			if (WebSocketUtils.getMessage(in).equals(GameConstants.MESSAGE_PING_KEY)) {
				WebSocketUtils.sendPing(out);
			}
			break;
		}

		case GameConstants.CODE_CLOSE: // Terminar WebSocket entre ambos.
			WebSocketUtils.sendClose(out);
			connected = false;
			break;

		case -1: // Se ha perdido conexión con el cliente.
			connected = false;
			break;

		default:
			break;

		}
	}

	/**
	 * Get client
	 * 
	 * @return Socket
	 */
	public Socket getClient() {
		return client;
	}

	/**
	 * Get out
	 * 
	 * @return OutputStream
	 */
	public OutputStream getOut() {
		return out;
	}

	/**
	 * Get connected
	 * 
	 * @param connected
	 */
	public synchronized boolean getConnected() {
		return connected;
	}
	
	/**
	 * Set connected
	 * 
	 * @param connected
	 */
	public synchronized void setConnected(boolean connected) {
		this.connected = connected;
		if (!this.connected) {
			try {
				WebSocketUtils.sendClose(out);
			} catch (IOException e) {
				log.error("Could not close socket after server disconection: {}", e.getMessage());
			}
		}
	}

}
