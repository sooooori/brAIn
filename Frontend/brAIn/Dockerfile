# Frontend용 Dockerfile 예시
# Node.js 기반의 프론트엔드 애플리케이션을 예로 들겠습니다.

# Base image
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 파일 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 (프론트엔드의 경우, 이 과정은 프로젝트에 따라 다를 수 있습니다)
RUN npm run build

# 애플리케이션 실행
CMD ["npm", "start"]

# 애플리케이션이 사용하는 포트
EXPOSE 80
