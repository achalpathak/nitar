FROM python:3
ENV PYTHONBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /application

RUN apt-get update && apt-get -y dist-upgrade
RUN apt install -y netcat
RUN pip install --upgrade pip
RUN apt install nodejs -y
COPY ./requirements.txt .
RUN pip install -r requirements.txt


COPY . .

RUN adduser docker_user
RUN chown -R docker_user:docker_user /application
RUN chmod -R 755 /application
USER docker_user