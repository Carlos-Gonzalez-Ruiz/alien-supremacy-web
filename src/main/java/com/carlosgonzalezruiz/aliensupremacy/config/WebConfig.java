package com.carlosgonzalezruiz.aliensupremacy.config;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.spring6.view.ThymeleafViewResolver;
import org.thymeleaf.templatemode.TemplateMode;

/**
 * Alien Supremacy - Proyecto Fin de Ciclo
 * 
 * Clase de configuración de Spring.
 * 
 * @author Carlos González Ruiz - 2ºDAM
 */
@Configuration
@EnableWebMvc
@ComponentScan
public class WebConfig implements WebMvcConfigurer, ApplicationContextAware {

	/** Contexto de la aplicación. */
	private ApplicationContext applicationContext;

	/**
	 * Método constructor de la clase.
	 */
	public WebConfig() {
		super();
	}

	/**
	 * Establece el atributo applicationContext.
	 * 
	 * @param applicationContext el contexto de la aplicación.
	 * @throws BeanException
	 */
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}

	/**
	 * Método que añade redireccionamiento a recursos dentros de webapp al registry.
	 * 
	 * @param registry el registro.
	 */
	@Override
	public void addResourceHandlers(final ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/audio/**").addResourceLocations("/audio/");
		registry.addResourceHandler("/image/**").addResourceLocations("/image/");
		registry.addResourceHandler("/css/**").addResourceLocations("/css/");
		registry.addResourceHandler("/js/**").addResourceLocations("/js/");
	}

	/**
	 * Método que añade manualmente el mapeo al index.html del Home. 
	 * https://stackoverflow.com/questions/27381781/java-spring-boot-how-to-map-my-app-root-to-index-html
	 * 
	 * @param registry el registro.
	 */
	@Override
	public void addViewControllers(final ViewControllerRegistry registry) {
		registry.addViewController("/").setViewName("forward:/index.html"); // Use redirect (?)
	}

	/**
	 * Método messageSource
	 * 
	 * @return el messageSource. 
	 */
	@Bean
	public ResourceBundleMessageSource messageSource() {
		ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
		messageSource.setBasename("Messages");
		return messageSource;
	}

	/*
	 * @Override public void addFormatters(final FormatterRegistry registry) {
	 * this.addFormatters(registry); registry.addFormatter(varietyFormatter());
	 * registry.addFormatter(dateFormatter()); }
	 * 
	 * @Bean public VarietyFormatter varietyFormatter() { return new
	 * VarietyFormatter(); }
	 * 
	 * @Bean public DateFormatter dateFormatter() { return new DateFormatter(); }
	 */

	/* **************************************************************** */
	/* THYMELEAF-SPECIFIC ARTIFACTS */
	/* TemplateResolver <- TemplateEngine <- ViewResolver */
	/* **************************************************************** */

	/**
	 * Método templateResolver.
	 * 
	 * @return el templateResolver.
	 */
	@Bean
	public SpringResourceTemplateResolver templateResolver() {
		// SpringResourceTemplateResolver automatically integrates with Spring's own
		// resource resolution infrastructure, which is highly recommended.
		SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();
		templateResolver.setApplicationContext(this.applicationContext);
		templateResolver.setPrefix("/WEB-INF/templates/");
		templateResolver.setSuffix(".html");
		// HTML is the default value, added here for the sake of clarity.
		templateResolver.setTemplateMode(TemplateMode.HTML);
		// Template cache is true by default. Set to false if you want
		// templates to be automatically updated when modified.
		templateResolver.setCacheable(true);
		return templateResolver;
	}

	/**
	 * Método templateEngine.
	 * 
	 * @return el templateEngine.
	 */
	@Bean
	public SpringTemplateEngine templateEngine() {
		// SpringTemplateEngine automatically applies SpringStandardDialect and
		// enables Spring's own MessageSource message resolution mechanisms.
		SpringTemplateEngine templateEngine = new SpringTemplateEngine();
		templateEngine.setTemplateResolver(templateResolver());
		// Enabling the SpringEL compiler with Spring 4.2.4 or newer can
		// speed up execution in most scenarios, but might be incompatible
		// with specific cases when expressions in one template are reused
		// across different data types, so this flag is "false" by default
		// for safer backwards compatibility.
		templateEngine.setEnableSpringELCompiler(true);
		return templateEngine;
	}

	/**
	 * Método viewResolver.
	 * 
	 * @return el viewResolver.
	 */
	@Bean
	public ThymeleafViewResolver viewResolver() {
		ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
		viewResolver.setTemplateEngine(templateEngine());
		return viewResolver;
	}

}
