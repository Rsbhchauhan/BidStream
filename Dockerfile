# Build Stage
# Using ECR Public mirrors to bypass Docker Hub auth issues
FROM public.ecr.aws/docker/library/maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy everything from the backend directory
COPY backend/ .

# Build the jar
RUN mvn clean package -DskipTests

# Run Stage
FROM public.ecr.aws/docker/library/openjdk:17-jdk-slim
WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
