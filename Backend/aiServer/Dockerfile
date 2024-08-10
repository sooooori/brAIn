# 베이스 이미지로 Python 3.8 사용
FROM python:3.8-slim

# 작업 디렉토리 생성
WORKDIR /app

# 의존성 파일을 컨테이너에 복사
COPY requirements.txt requirements.txt

# 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# Flask 애플리케이션 실행
CMD ["python", "serv.py"]