FROM python:3.11.0
ENV PYTHONBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /application

RUN adduser docker_user
RUN chown -R docker_user:docker_user /application
RUN chmod -R 755 /application
USER docker_user

RUN apt-get update && apt-get -y dist-upgrade
RUN apt install -y netcat
RUN pip install --upgrade pip
RUN apt install nodejs -y
COPY ./requirements.txt .
RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm
RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

COPY . .


RUN pip install -r requirements.txt