# Build Stage
# Using Amazon Corretto from ECR Public to avoid Docker Hub auth issues
FROM public.ecr.aws/amazoncorretto/amazoncorretto:17 AS build
WORKDIR /app

# Copy only the necessary files for building
COPY backend/ .

# Ensure the Maven wrapper is executable and build the jar
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Run Stage
FROM public.ecr.aws/amazoncorretto/amazoncorretto:17-alpine
WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
