FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
ARG JAR_FILE
COPY alien-supremacy-back.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
