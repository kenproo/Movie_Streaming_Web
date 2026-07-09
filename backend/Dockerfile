# Stage 1: Build the application using Maven and JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml to cache dependency downloads
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source files and package jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal runtime image using JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-root user for maximum container security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose Spring Boot default port
EXPOSE 8080

# Start Spring Boot with optimized JVM garbage collection and memory settings
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
