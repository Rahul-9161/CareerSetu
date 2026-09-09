# ============================================================
# CareerSetu Backend Dockerfile (Multi-stage Production Build)
# ============================================================

# ── Stage 1: Build Application ──
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and compile
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Minimal Production JRE Runtime ──
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create unprivileged user for security compliance
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built artifact
COPY --from=builder /build/target/careersetu-backend-1.0.0-SNAPSHOT.jar app.jar

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8080

# Optimized container memory allocation flags
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
