package in.careersetu.common.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * EnvironmentPostProcessor that dynamically parses and configures database connection
 * settings for cloud environments like Render, Railway, Supabase, Neon, and Heroku.
 *
 * <p>Supports:
 * <ul>
 *   <li>Render/Heroku style URLs: {@code postgres://user:password@host:port/database}</li>
 *   <li>Standard JDBC URLs: {@code jdbc:postgresql://host:port/database}</li>
 *   <li>Zero-config fallback to in-memory H2 if no database is attached</li>
 * </ul>
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final Logger log = LoggerFactory.getLogger(DatabaseUrlEnvironmentPostProcessor.class);
    private static final String PROPERTY_SOURCE_NAME = "careerSetuDatabaseConfig";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> props = new HashMap<>();

        String rawDatabaseUrl = environment.getProperty("DATABASE_URL");
        if (rawDatabaseUrl == null || rawDatabaseUrl.isBlank()) {
            rawDatabaseUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        }

        if (rawDatabaseUrl != null && !rawDatabaseUrl.isBlank()) {
            try {
                if (rawDatabaseUrl.startsWith("postgres://") || rawDatabaseUrl.startsWith("postgresql://")) {
                    URI uri = new URI(rawDatabaseUrl);
                    String userInfo = uri.getUserInfo();
                    String username = null;
                    String password = null;

                    if (userInfo != null && userInfo.contains(":")) {
                        String[] parts = userInfo.split(":", 2);
                        username = parts[0];
                        password = parts[1];
                    } else if (userInfo != null) {
                        username = userInfo;
                    }

                    String host = uri.getHost();
                    int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                    String path = uri.getPath() != null ? uri.getPath() : "/careersetu";
                    String query = uri.getQuery();

                    String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + (query != null ? "?" + query : "");

                    props.put("spring.datasource.url", jdbcUrl);
                    props.put("spring.datasource.driver-class-name", "org.postgresql.Driver");
                    if (username != null) {
                        props.put("spring.datasource.username", username);
                    }
                    if (password != null) {
                        props.put("spring.datasource.password", password);
                    }
                    props.put("spring.flyway.enabled", "true");
                    props.put("spring.jpa.hibernate.ddl-auto", "update");
                    props.put("spring.jpa.properties.hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");

                    log.info("Configured PostgreSQL datasource from cloud DATABASE_URL: jdbc:postgresql://{}:{}{}", host, port, path);
                } else if (rawDatabaseUrl.startsWith("jdbc:postgresql://")) {
                    props.put("spring.datasource.url", rawDatabaseUrl);
                    props.put("spring.datasource.driver-class-name", "org.postgresql.Driver");
                    props.put("spring.flyway.enabled", "true");
                    props.put("spring.jpa.hibernate.ddl-auto", "update");
                    props.put("spring.jpa.properties.hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
                    log.info("Configured PostgreSQL datasource from JDBC URL");
                }
            } catch (Exception e) {
                log.warn("Failed to parse DATABASE_URL ({}). Defaulting to standard properties.", e.getMessage());
            }
        } else {
            // No DATABASE_URL provided — configure resilient in-memory H2 so cloud service boots with 200 OK
            log.info("No cloud DATABASE_URL detected. Configuring resilient in-memory PostgreSQL-mode H2 database.");
            props.put("spring.datasource.url", "jdbc:h2:mem:careersetu;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE");
            props.put("spring.datasource.driver-class-name", "org.h2.Driver");
            props.put("spring.datasource.username", "sa");
            props.put("spring.datasource.password", "");
            props.put("spring.flyway.enabled", "false");
            props.put("spring.jpa.hibernate.ddl-auto", "update");
            props.put("spring.jpa.properties.hibernate.dialect", "org.hibernate.dialect.H2Dialect");
        }

        if (!props.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, props));
        }
    }
}
