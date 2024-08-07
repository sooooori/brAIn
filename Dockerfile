# 베이스 이미지로 OpenJDK 17 사용
FROM openjdk:17-jdk-alpine

# 애플리케이션 JAR 파일을 빌드할 때 사용할 ARG
ARG JAR_FILE=build/libs/brAIn-0.0.1-SNAPSHOT.jar

# 컨테이너 내에 디렉토리 생성
WORKDIR /app

# JAR 파일을 컨테이너 내로 복사
COPY ${JAR_FILE} app.jar

# 애플리케이션을 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
