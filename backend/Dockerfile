# Stage 1: Build the application using Maven and JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml first to cache dependency downloads
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source files and package jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal runtime image using JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Set timezone
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/UTC /etc/localtime && \
    echo "UTC" > /etc/timezone

# Run as non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose Spring Boot default port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -q --spider http://localhost:8080/api/actuator/health || exit 1

# Start Spring Boot
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -XX:+UseG1GC -XX:MaxRAMPercentage=70.0 -XX:InitialRAMPercentage=30.0 -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
