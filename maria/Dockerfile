
# Dockerfile
FROM mariadb:latest

# Install netcat
RUN apt-get update && \
    apt-get install -y netcat && \
    apt-get clean

# Set default environment variables
ENV MYSQL_ROOT_PASSWORD=ssafy \
    MYSQL_DATABASE=brAIn \
    MYSQL_USER=ssafy \
    MYSQL_PASSWORD=ssafy

# Expose port
EXPOSE 3306