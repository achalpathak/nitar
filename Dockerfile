FROM python:3.11.0
ENV PYTHONBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1


RUN apt-get update && apt-get -y dist-upgrade
RUN apt install -y netcat
RUN apt install nodejs -y
RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm
RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest



RUN useradd -ms /bin/bash docker_user
RUN chown -R docker_user:docker_user /application
RUN chmod -R 755 /application
RUN chmod -R 775 /application/run_server.sh
USER docker_user

WORKDIR /home/docker-user/application
COPY . .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt