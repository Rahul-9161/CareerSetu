package in.careersetu.common.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Robust DataSource configuration for Cloud (Render, Railway, Supabase, Neon) and Local environments.
 *
 * <p>Automatically parses:
 * <ul>
 *   <li>Render/Heroku style URLs: {@code postgres://user:password@host:port/database}</li>
 *   <li>Standard JDBC URLs: {@code jdbc:postgresql://host:port/database}</li>
 *   <li>Fallback: Embedded in-memory PostgreSQL-mode H2 database for zero-config cloud boot</li>
 * </ul>
 */
@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(Environment env) {
        String rawDatabaseUrl = env.getProperty("DATABASE_URL");
        if (rawDatabaseUrl == null || rawDatabaseUrl.isBlank()) {
            rawDatabaseUrl = env.getProperty("SPRING_DATASOURCE_URL");
        }
        if (rawDatabaseUrl == null || rawDatabaseUrl.isBlank()) {
            rawDatabaseUrl = env.getProperty("spring.datasource.url");
        }

        HikariConfig config = new HikariConfig();
        config.setPoolName("CareerSetuHikariPool");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        if (rawDatabaseUrl != null && !rawDatabaseUrl.isBlank() && !rawDatabaseUrl.contains("localhost")) {
            try {
                if (rawDatabaseUrl.startsWith("postgres://") || rawDatabaseUrl.startsWith("postgresql://")) {
                    URI uri = new URI(rawDatabaseUrl);
                    String userInfo = uri.getUserInfo();
                    String username = env.getProperty("DATABASE_USER", env.getProperty("spring.datasource.username"));
                    String password = env.getProperty("DATABASE_PASSWORD", env.getProperty("spring.datasource.password"));

                    if (userInfo != null && userInfo.contains(":")) {
                        String[] parts = userInfo.split(":", 2);
                        username = parts[0];
                        password = parts[1];
                    } else if (userInfo != null) {
                        username = userInfo;
                    }

                    String host = uri.getHost();
                    int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                    String path = uri.getPath() != null && !uri.getPath().isEmpty() ? uri.getPath() : "/careersetu";
                    String query = uri.getQuery();

                    String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + (query != null ? "?" + query : "");

                    config.setJdbcUrl(jdbcUrl);
                    config.setDriverClassName("org.postgresql.Driver");
                    if (username != null) {
                        config.setUsername(username);
                    }
                    if (password != null) {
                        config.setPassword(password);
                    }
                    log.info("Initialized PostgreSQL DataSource for host: {}:{}", host, port);
                    return new HikariDataSource(config);
                } else if (rawDatabaseUrl.startsWith("jdbc:postgresql://")) {
                    config.setJdbcUrl(rawDatabaseUrl);
                    config.setDriverClassName("org.postgresql.Driver");
                    String username = env.getProperty("DATABASE_USER", env.getProperty("spring.datasource.username", "careersetu_user"));
                    String password = env.getProperty("DATABASE_PASSWORD", env.getProperty("spring.datasource.password", ""));
                    if (username != null) {
                        config.setUsername(username);
                    }
                    if (password != null) {
                        config.setPassword(password);
                    }
                    log.info("Initialized PostgreSQL DataSource from JDBC URL: {}", rawDatabaseUrl);
                    return new HikariDataSource(config);
                }
            } catch (Exception e) {
                log.warn("Failed to parse database URL ({}), falling back to in-memory H2: {}", rawDatabaseUrl, e.getMessage());
            }
        }

        // Fallback: In-memory PostgreSQL-mode H2 Database
        log.info("No remote PostgreSQL configured. Using embedded in-memory PostgreSQL-compatible H2 database for zero-failure startup.");
        config.setJdbcUrl("jdbc:h2:mem:careersetu;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE");
        config.setDriverClassName("org.h2.Driver");
        config.setUsername("sa");
        config.setPassword("");
        return new HikariDataSource(config);
    }
}
