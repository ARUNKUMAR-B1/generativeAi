# Use OpenJDK 17 (or 21 if your project uses that version)
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the JAR file from target folder into container
COPY target/onlinenews-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Spring Boot default is 8080)
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
