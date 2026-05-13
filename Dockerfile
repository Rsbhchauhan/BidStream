# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and source code from the backend directory
COPY backend/pom.xml .
COPY backend/src ./src

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create uploads directory for images
RUN mkdir -p /app/uploads

# Expose the port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
