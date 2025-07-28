# ---- Build Stage ----
FROM eclipse-temurin:17-jdk-jammy AS build

# Set working directory
WORKDIR /app

# Copy Maven files and download dependencies first (for caching)
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline

# Copy source code and build the jar
COPY src src
RUN ./mvnw clean package -DskipTests

# ---- Run Stage ----
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copy built jar from previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose Spring Boot default port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
