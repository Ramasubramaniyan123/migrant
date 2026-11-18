# Build stage
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (tests are enforced in CI before image build;
# Docker builds skip them to keep the image pipeline fast and DB-independent)
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

# Non-root runtime user
RUN groupadd -r appuser && useradd -r -g appuser -u 1001 appuser \
    && mkdir -p /app/uploads && chown -R appuser:appuser /app

# Copy the built jar from build stage
COPY --from=build --chown=appuser:appuser /app/target/*.jar app.jar

USER appuser

# Expose port
EXPOSE 8080

# Health check (context path is /api)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-Duser.timezone=UTC", "-jar", "app.jar"]
